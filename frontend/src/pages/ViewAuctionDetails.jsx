import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import React, { useEffect } from "react";
import { FaGreaterThan, FaTrophy } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id, dispatch, navigateTo, user.role]);

  return (
    <div className="w-full min-h-screen bg-zinc-50 lg:pl-[280px] py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
          <FaGreaterThan className="text-[10px]" />
          <Link to="/view-my-auctions" className="hover:text-primary transition-colors font-medium">My Auctions</Link>
          <FaGreaterThan className="text-[10px]" />
          <span className="text-zinc-900 font-bold truncate max-w-[200px]">{auctionDetail.title}</span>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Auction Details */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-64 h-64 bg-zinc-50 rounded-2xl p-4 flex items-center justify-center border border-zinc-100">
                    <img
                      src={auctionDetail.image?.url}
                      alt={auctionDetail.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h1 className="text-3xl font-black text-zinc-900 mb-2">{auctionDetail.title}</h1>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm font-bold">
                          Condition: {auctionDetail.condition}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                          Min Bid: ${auctionDetail.startingBid}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-2">Description</h3>
                      <div className="prose prose-zinc max-w-none text-zinc-600">
                        {auctionDetail.description?.split(". ").map((element, index) => (
                          <p key={index} className="mb-2">{element}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Bidders List */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden sticky top-8">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                  <h2 className="text-xl font-black text-zinc-900">
                    {new Date(auctionDetail.endTime) < Date.now() ? "Bid History" : "Live Bids"}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {new Date(auctionDetail.endTime) < Date.now() ? "Final auction results" : "Real-time bidding activity"}
                  </p>
                </div>

                <div className="max-h-[600px] overflow-y-auto p-4 custom-scrollbar">
                  {auctionBidders &&
                    auctionBidders.length > 0 &&
                    new Date(auctionDetail.startTime) < Date.now() ? (
                    <div className="space-y-3">
                      {auctionBidders.map((element, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`
                            flex items-center justify-between p-4 rounded-2xl border transition-all
                            ${index === 0 ? 'bg-yellow-50 border-yellow-100 shadow-sm' :
                              index === 1 ? 'bg-zinc-50 border-zinc-100' :
                                index === 2 ? 'bg-orange-50 border-orange-100' :
                                  'bg-white border-zinc-100'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={element.profileImage}
                                alt={element.userName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                              {index < 3 && (
                                <div className={`
                                  absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white
                                  ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-zinc-400' : 'bg-orange-500'}
                                `}>
                                  {index + 1}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 text-sm">{element.userName}</p>
                              <p className="text-xs text-zinc-500">
                                {index === 0 ? 'Highest Bidder' : `${index + 1}th Place`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-zinc-900">${element.amount}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      {Date.now() < new Date(auctionDetail.startTime) ? (
                        <>
                          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-2xl">⏳</div>
                          <h3 className="text-lg font-bold text-zinc-900">Not Started Yet</h3>
                          <p className="text-zinc-500 text-sm mt-1">Bidding will open soon</p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-2xl">🏁</div>
                          <h3 className="text-lg font-bold text-zinc-900">Auction Ended</h3>
                          <p className="text-zinc-500 text-sm mt-1">This auction has closed</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ViewAuctionDetails;
