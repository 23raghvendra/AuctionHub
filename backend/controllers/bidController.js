import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";

import { getSocketIO } from "../socket.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { amount, bidType = "manual" } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 404));
  }

  // Retry mechanism for optimistic locking
  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    attempt++;

    try {
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

      const minIncrement = auctionItem.minBidIncrement || 10;

      // Handle Auto-Bid Setup
      if (bidType === "auto") {
        if (amount <= auctionItem.currentBid) {
          return next(new ErrorHandler("Auto-bid limit must be greater than current bid.", 400));
        }

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

        await processBid(auctionItem, req.user._id, amount);
      }

      // Resolve Auto-Bids (Proxy Bidding Loop)
      let active = true;
      let iterations = 0;
      const MAX_ITERATIONS = 50;

      while (active && iterations < MAX_ITERATIONS) {
        active = false;
        iterations++;

        const nextMinBid = auctionItem.currentBid + minIncrement;
        const candidates = auctionItem.autoBids.filter(ab =>
          ab.userId.toString() !== auctionItem.highestBidder?.toString() &&
          ab.maxBid >= nextMinBid
        );

        if (candidates.length > 0) {
          candidates.sort((a, b) => b.maxBid - a.maxBid);
          const bestCandidate = candidates[0];
          const bidAmount = nextMinBid;

          await processBid(auctionItem, bestCandidate.userId, bidAmount);
          active = true;
        }
      }

      // Use optimistic locking with version check
      const savedAuction = await Auction.findOneAndUpdate(
        { _id: id, __v: auctionItem.__v },
        {
          $set: {
            currentBid: auctionItem.currentBid,
            highestBidder: auctionItem.highestBidder,
            bids: auctionItem.bids,
            autoBids: auctionItem.autoBids
          },
          $inc: { __v: 1 }
        },
        { new: true }
      );

      if (!savedAuction) {
        // Version conflict - another bid was placed, retry
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
          continue;
        }
        return next(new ErrorHandler("Bid conflict. Please try again.", 409));
      }

      // Success - emit socket event
      const io = getSocketIO();
      io.emit("auctionUpdate", {
        auctionId: id,
        currentBid: savedAuction.currentBid,
        bids: savedAuction.bids,
        highestBidder: savedAuction.highestBidder
      });

      return res.status(201).json({
        success: true,
        message: bidType === "auto" ? "Auto-bid configured." : "Bid placed.",
        currentBid: savedAuction.currentBid,
        autoBidActive: bidType === "auto"
      });

    } catch (error) {
      if (error.name === 'VersionError' && attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        continue;
      }
      throw error;
    }
  }

  return next(new ErrorHandler("Failed to place bid after multiple attempts.", 500));
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
