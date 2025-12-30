import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import PastAuctions from "./home-sub-components/PastAuctions";

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const stats = [
    { label: "Active Auctions", value: "1,200+" },
    { label: "Total Volume", value: "$4.5M+" },
    { label: "Happy Bidders", value: "85k+" },
  ];

  return (
    <section className="w-full ml-0 m-0 min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-red-500/20 text-red-500 text-sm font-semibold mb-6 border border-red-500/30 animate-pulse">
              🔥 Live Auctions Happening Now
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
              Discover Rare & <br />
              <span className="text-blue-500">Exclusive Collectibles</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
              The world's most premium marketplace for auctions. Bid in real-time, win exclusive items, and join a community of collectors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/sign-up"
                    className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                  >
                    Start Bidding
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-all border border-zinc-700"
                  >
                    Log In
                  </Link>
                </>
              ) : (
                <Link
                  to="/auctions"
                  className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                >
                  Browse Auctions
                </Link>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-zinc-400 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-20 lg:pl-[320px]">
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Featured Auctions</h2>
            <Link to="/auctions" className="text-primary font-semibold hover:underline">View All</Link>
          </div>
          <FeaturedAuctions />
        </div>

        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Upcoming Listings</h2>
            <Link to="/auctions" className="text-primary font-semibold hover:underline">View All</Link>
          </div>
          <UpcomingAuctions />
        </div>

        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-zinc-400">Past Auctions</h2>
            <Link to="/auctions" className="text-primary font-semibold hover:underline">View All</Link>
          </div>
          <PastAuctions />
        </div>


        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10">Top Collectors</h2>
          <Leaderboard />
        </div>
      </div>
    </section>
  );
};

export default Home;
