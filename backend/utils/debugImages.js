import mongoose from "mongoose";
import { config } from "dotenv";
import { Auction } from "../models/auctionSchema.js";

config({ path: "./config/config.env" });

const checkAuctions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔥 Connected to DB.");

        const auctions = await Auction.find().sort({ _id: -1 }).limit(3);
        console.log("Latest 3 Auctions Images:");
        auctions.forEach(a => {
            console.log(`Title: ${a.title}`);
            console.log(`Image URL: ${a.image?.url}`);
            console.log("---");
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

checkAuctions();
