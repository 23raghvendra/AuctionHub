import mongoose from "mongoose";
import { config } from "dotenv";
import { Auction } from "../models/auctionSchema.js";

config({ path: "./config/config.env" });

const cleanBrokenAuctions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔥 Connected to DB.");

        // Delete auctions with spaces in image URL
        const result = await Auction.deleteMany({ "image.url": { $regex: /\s/ } });
        console.log(`✅ Deleted ${result.deletedCount} broken auctions.`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

cleanBrokenAuctions();
