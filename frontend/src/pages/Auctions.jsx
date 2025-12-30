import Card from "@/custom-components/Card";
import SkeletonAuctionCard from "@/custom-components/SkeletonAuctionCard";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);

  return (
    <>
      <article className="w-full min-h-screen bg-zinc-50 lg:pl-[280px] py-12 px-6">
        <section className="max-w-7xl mx-auto">
          {/* Header Section (Same as before) */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 mb-2">
                Discover Auctions
              </h1>
              <p className="text-zinc-500 text-lg">
                Explore thousands of unique items up for bid
              </p>
            </div>

            <div className="flex gap-3">
              <select className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Collectibles</option>
                <option>Art</option>
              </select>
              <select className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Ending Soon</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              // Render 8 Skeleton Cards while loading
              [...Array(8)].map((_, index) => (
                <SkeletonAuctionCard key={index} />
              ))
            ) : (
              // Render Actual Auctions
              allAuctions.map((element, index) => (
                <motion.div
                  key={element._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    title={element.title}
                    startTime={element.startTime}
                    endTime={element.endTime}
                    imgSrc={element.image?.url}
                    startingBid={element.startingBid}
                    id={element._id}
                  />
                </motion.div>
              ))
            )}
          </div>

          {!loading && allAuctions.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-zinc-900">No auctions found</h3>
              <p className="text-zinc-500 mt-2">Try adjusting your filters or check back later</p>
            </div>
          )}
        </section>
      </article>
    </>
  );
};

export default Auctions;
