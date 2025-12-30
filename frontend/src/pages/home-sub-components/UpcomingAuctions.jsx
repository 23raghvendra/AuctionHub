import React from "react";
import { RiAuctionFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const UpcomingAuctions = () => {
  const { allAuctions } = useSelector((state) => state.auction);

  const today = new Date();
  const todayString = today.toDateString();

  const auctionsStartingToday = allAuctions.filter((item) => {
    const auctionDate = new Date(item.startTime);
    return auctionDate.toDateString() === todayString;
  });

  return (
    <section className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 rounded-2xl p-6 flex flex-col justify-between text-white shadow-xl"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-primary text-xl mb-4">
            <RiAuctionFill />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-100 mb-1">
              Auctions Starting
            </h3>
            <h3 className="text-3xl font-black text-white">
              Today
            </h3>
            <p className="text-zinc-400 mt-2 text-sm">
              Don't miss out on these exclusive items going live today.
            </p>
          </div>
        </motion.div>

        {/* Auction Cards */}
        {auctionsStartingToday.slice(0, 6).map((element, index) => (
          <motion.div
            key={element._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/auction/item/${element._id}`}
              className="group block bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-zinc-50 overflow-hidden shrink-0">
                  <img
                    src={element.image?.url}
                    alt={element.title}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 line-clamp-1 group-hover:text-primary transition-colors">
                    {element.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Starts at <span className="font-medium text-zinc-900">{new Date(element.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-zinc-100 flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Starting Bid</span>
                <span className="text-primary font-black">
                  ${element.startingBid}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingAuctions;
