import Card from "@/custom-components/Card";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const FeaturedAuctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);

  // Filter out ended auctions (keep only active and upcoming)
  const activeAuctions = allAuctions.filter(element => new Date(element.endTime) > Date.now());

  return (
    <section className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeAuctions.slice(0, 8).map((element, index) => (
          <motion.div
            key={element._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              title={element.title}
              imgSrc={element.image?.url}
              startTime={element.startTime}
              endTime={element.endTime}
              startingBid={element.startingBid}
              id={element._id}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedAuctions;
