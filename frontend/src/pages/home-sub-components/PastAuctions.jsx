import Card from "@/custom-components/Card";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const PastAuctions = () => {
    const { allAuctions } = useSelector((state) => state.auction);

    const pastAuctions = allAuctions
        .filter((element) => new Date(element.endTime) < Date.now())
        .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

    return (
        <section className="my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pastAuctions.slice(0, 8).map((element, index) => (
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
                {pastAuctions.length === 0 && (
                    <div className="col-span-full text-center py-10 text-zinc-500">
                        No past auctions available.
                    </div>
                )}
            </div>
        </section>
    );
};

export default PastAuctions;
