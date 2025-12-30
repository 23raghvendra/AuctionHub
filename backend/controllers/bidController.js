import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";

import { getSocketIO } from "../socket.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not found.", 404));
  }

  if (auctionItem.status !== "Active") {
    return next(new ErrorHandler("Auction is not active.", 400));
  }
  if (auctionItem.endTime < Date.now()) {
    return next(new ErrorHandler("Auction is ended.", 400));
  }
  if (auctionItem.createdBy.toString() === req.user._id.toString()) {
    return next(new ErrorHandler("You cannot bid on your own auction.", 400));
  }

  const { amount, bidType = "manual" } = req.body; // bidType: 'manual' or 'auto'
  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 404));
  }

  const minIncrement = auctionItem.minBidIncrement || 10;

  // Handle Auto-Bid Setup
  if (bidType === "auto") {
    // For auto-bid, 'amount' is the maximum limit
    if (amount <= auctionItem.currentBid) {
      return next(new ErrorHandler("Auto-bid limit must be greater than current bid.", 400));
    }

    // Update or Add Auto-Bid
    const existingAutoBidIndex = auctionItem.autoBids.findIndex(
      (ab) => ab.userId.toString() === req.user._id.toString()
    );

    if (existingAutoBidIndex !== -1) {
      auctionItem.autoBids[existingAutoBidIndex].maxBid = amount;
    } else {
      auctionItem.autoBids.push({
        userId: req.user._id,
        maxBid: amount,
      });
    }

    // We don't place a bid immediately unless needed.
    // The resolution loop below will handle placing the bid if this auto-bid is competitive.
  } else {
    // Manual Bid Validation
    if (amount <= auctionItem.currentBid) {
      return next(new ErrorHandler("Bid amount must be greater than the current bid.", 400));
    }
    if (amount < auctionItem.currentBid + minIncrement) {
      return next(new ErrorHandler(`Bid must be at least ${auctionItem.currentBid + minIncrement}`, 400));
    }
    if (amount < auctionItem.startingBid) {
      return next(new ErrorHandler("Bid amount must be greater than starting bid.", 404));
    }

    // Place the manual bid first
    await processBid(auctionItem, req.user._id, amount);
  }

  // Resolve Auto-Bids (Proxy Bidding Loop)
  // This loop runs until no auto-bid can beat the current highest bid
  let active = true;
  let iterations = 0;
  const MAX_ITERATIONS = 50; // Safety break

  while (active && iterations < MAX_ITERATIONS) {
    active = false;
    iterations++;

    // Find the highest auto-bidder who is NOT the current highest bidder
    // and whose maxBid is high enough to place a valid new bid
    const nextMinBid = auctionItem.currentBid + minIncrement;

    const candidates = auctionItem.autoBids.filter(ab =>
      ab.userId.toString() !== auctionItem.highestBidder?.toString() &&
      ab.maxBid >= nextMinBid
    );

    if (candidates.length > 0) {
      // Sort by maxBid descending to find the strongest competitor
      candidates.sort((a, b) => b.maxBid - a.maxBid);
      const bestCandidate = candidates[0];

      // Place bid for this candidate
      // They bid the minimum necessary: currentBid + increment
      // But if their maxBid is exactly the nextMinBid, they bid that.
      // If they have more headroom, they still only bid nextMinBid to lead.
      const bidAmount = nextMinBid;

      await processBid(auctionItem, bestCandidate.userId, bidAmount);
      active = true; // A bid was placed, so we need to check if anyone else can beat it
    }
  }

  await auctionItem.save();

  // Emit Socket Event
  const io = getSocketIO();
  io.emit("auctionUpdate", {
    auctionId: id,
    currentBid: auctionItem.currentBid,
    bids: auctionItem.bids,
    highestBidder: auctionItem.highestBidder
  });

  res.status(201).json({
    success: true,
    message: bidType === "auto" ? "Auto-bid configured." : "Bid placed.",
    currentBid: auctionItem.currentBid,
    autoBidActive: bidType === "auto"
  });
});


export const getWonItems = catchAsyncErrors(async (req, res, next) => {
  const wonItems = await Auction.find({
    highestBidder: req.user._id,
    endTime: { $lt: Date.now() },
  });

  res.status(200).json({
    success: true,
    items: wonItems,
  });
});

// Helper function to process a single bid
async function processBid(auctionItem, userId, amount) {
  const existingBid = await Bid.findOne({
    "bidder.id": userId,
    auctionItem: auctionItem._id,
  });

  const existingBidInAuction = auctionItem.bids.find(
    (bid) => bid.userId.toString() == userId.toString()
  );

  if (existingBid && existingBidInAuction) {
    existingBidInAuction.amount = amount;
    existingBid.amount = amount;
    await existingBidInAuction.save();
    await existingBid.save();
  } else {
    const bidderDetail = await User.findById(userId);
    const bid = await Bid.create({
      amount,
      bidder: {
        id: bidderDetail._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
      },
      auctionItem: auctionItem._id,
    });
    auctionItem.bids.push({
      userId: userId,
      userName: bidderDetail.userName,
      profileImage: bidderDetail.profileImage?.url,
      amount,
    });
  }

  auctionItem.currentBid = amount;
  auctionItem.highestBidder = userId;
}
