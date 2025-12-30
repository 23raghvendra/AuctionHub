import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail, updateAuctionBid } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState, useRef } from "react";
import { FaGreaterThan, FaHistory, FaTrophy } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "@/context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [amount, setAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [isAutoBid, setIsAutoBid] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id, dispatch, navigateTo]);

  // Real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("auctionUpdate", (data) => {
        if (data.auctionId === id) {
          dispatch(updateAuctionBid(data));
          // Optional: Add a sound effect here
        }
      });
      return () => {
        socket.off("auctionUpdate");
      };
    }
  }, [socket, id, dispatch]);

  // Countdown Timer
  useEffect(() => {
    if (!auctionDetail?.endTime) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auctionDetail.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("Auction Ended");
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [auctionDetail?.endTime]);

  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("bidType", isAutoBid ? "auto" : "manual");
    dispatch(placeBid(id, formData));
    setAmount(0);
  };

  if (loading) return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <section className="w-full min-h-screen bg-zinc-50 pt-24 pb-10 px-4 lg:pl-[340px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <FaGreaterThan className="text-xs" />
        <Link to="/auctions" className="hover:text-primary transition-colors">Auctions</Link>
        <FaGreaterThan className="text-xs" />
        <span className="text-zinc-900 font-medium truncate max-w-[200px]">{auctionDetail.title}</span>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Column: Image & Details */}
        <div className="flex-1 space-y-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 overflow-hidden relative group">
            <div className="aspect-square w-full relative bg-zinc-100 rounded-xl overflow-hidden">
              <img
                src={auctionDetail.image?.url}
                alt={auctionDetail.title}
                className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100">
            <h3 className="text-2xl font-bold text-zinc-900 mb-6">Description</h3>
            <div className="prose prose-zinc max-w-none text-zinc-600">
              {auctionDetail.description?.split(". ").map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bidding Panel */}
        <div className="w-full xl:w-[450px] space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-zinc-100 sticky top-24">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">{auctionDetail.title}</h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${auctionDetail.condition === "New" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                  {auctionDetail.condition}
                </span>
                <span className="text-sm text-zinc-500">
                  Listed by {auctionDetail.createdBy?.userName || "Unknown"}
                </span>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl p-6 mb-6 border border-zinc-100">
              {/* Only show Current Bid and Live indicator for active auctions */}
              {new Date(auctionDetail.endTime) > Date.now() && new Date(auctionDetail.startTime) < Date.now() ? (
                <>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-zinc-500 font-medium">Current Bid</span>
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      Live
                    </div>
                  </div>
                  <motion.div
                    key={auctionDetail.currentBid}
                    initial={{ scale: 1.2, color: "#d6482b" }}
                    animate={{ scale: 1, color: "#000" }}
                    className="text-5xl font-black tracking-tight"
                  >
                    ${auctionDetail.currentBid?.toLocaleString()}
                  </motion.div>
                  <div className="mt-4 pt-4 border-t border-zinc-200 flex justify-between items-center">
                    <span className="text-zinc-500 text-sm">Time Remaining</span>
                    <span className="font-mono font-bold text-lg text-zinc-900">{timeLeft}</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Show auction status for non-active auctions */}
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">
                      {new Date(auctionDetail.startTime) > Date.now() ? "⏳" : "🏁"}
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-2">
                      {new Date(auctionDetail.startTime) > Date.now() ? "Auction Upcoming" : "Auction Ended"}
                    </h3>
                    <p className="text-zinc-500">
                      {new Date(auctionDetail.startTime) > Date.now()
                        ? `Starts: ${new Date(auctionDetail.startTime).toLocaleString()}`
                        : `Ended: ${new Date(auctionDetail.endTime).toLocaleString()}`
                      }
                    </p>
                    {new Date(auctionDetail.endTime) < Date.now() && auctionDetail.currentBid > 0 && (
                      <div className="mt-4 pt-4 border-t border-zinc-200">
                        <span className="text-zinc-500 text-sm block mb-1">Final Bid</span>
                        <span className="text-3xl font-black text-zinc-900">${auctionDetail.currentBid?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Bidding Controls */}
            {new Date(auctionDetail.endTime) > Date.now() && new Date(auctionDetail.startTime) < Date.now() ? (
              <div className="space-y-4">
                {/* Auto-Bid Toggle */}
                <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                  <span className="text-sm font-bold text-zinc-700">Enable Auto-Bid</span>
                  <button
                    onClick={() => setIsAutoBid(!isAutoBid)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isAutoBid ? "bg-primary" : "bg-zinc-300"}`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAutoBid ? "translate-x-6" : "translate-x-0"}`}
                    />
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder={isAutoBid ? "Enter your maximum bid limit" : `Min bid: ${auctionDetail.currentBid + (auctionDetail.minBidIncrement || 10)}`}
                  />
                </div>
                <button
                  onClick={handleBid}
                  disabled={amount <= auctionDetail.currentBid}
                  className={`w-full py-4 font-bold rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2
                    ${isAutoBid
                      ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/25"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25"
                    }`}
                >
                  {isAutoBid ? (
                    <>
                      <RiAuctionFill className="text-xl" />
                      Set Auto Bid
                    </>
                  ) : (
                    <>
                      <RiAuctionFill className="text-xl" />
                      Place Bid
                    </>
                  )}
                </button>
                {isAutoBid && (
                  <p className="text-xs text-zinc-500 text-center">
                    System will automatically bid for you up to your max limit.
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-zinc-100 rounded-xl text-center font-bold text-zinc-500">
                {new Date(auctionDetail.startTime) > Date.now() ? "Auction Starts Soon" : "Auction Ended"}
              </div>
            )}

            {/* Bid History */}
            <div className="mt-8">
              <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <FaHistory className="text-zinc-400" />
                Bid History
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {auctionBidders && auctionBidders.length > 0 ? (
                    [...auctionBidders].reverse().map((bid, index) => (
                      <motion.div
                        key={`${bid.userId}-${bid.amount}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-zinc-100 hover:border-zinc-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={bid.profileImage}
                            alt={bid.userName}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <p className="font-bold text-sm text-zinc-900">{bid.userName}</p>
                            <p className="text-xs text-zinc-500">{new Date().toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {index === 0 && <FaTrophy className="text-yellow-500 text-sm" />}
                          <span className="font-bold text-zinc-900">${bid.amount.toLocaleString()}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-zinc-400 py-4 text-sm">No bids yet. Be the first!</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionItem;
