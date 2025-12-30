import CardTwo from "@/custom-components/CardTwo";
import Spinner from "@/custom-components/Spinner";
import { getMyAuctionItems } from "@/store/slices/auctionSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ViewMyAuctions = () => {
  const { myAuctions, loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
    }
    dispatch(getMyAuctionItems());
  }, [dispatch, isAuthenticated, navigateTo, user.role]);

  const activeAuctions = myAuctions.filter(item => new Date(item.endTime) > Date.now());

  return (
    <div className="w-full min-h-screen bg-zinc-50 lg:pl-[280px] py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-10">
          <h1 className="text-4xl font-black text-zinc-900 mb-2">My Active Auctions</h1>
          <p className="text-zinc-500 text-lg">Manage your currently running auctions</p>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeAuctions.length > 0 ? (
              activeAuctions.map((element, index) => (
                <motion.div
                  key={element._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CardTwo
                    title={element.title}
                    startingBid={element.startingBid}
                    endTime={element.endTime}
                    startTime={element.startTime}
                    imgSrc={element.image?.url}
                    id={element._id}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  📦
                </div>
                <h3 className="text-xl font-bold text-zinc-900">No auctions listed yet</h3>
                <p className="text-zinc-500 mt-2">Start selling by creating your first auction</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ViewMyAuctions;
