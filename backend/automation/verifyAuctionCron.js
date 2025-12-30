import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";

export const verifyAuctionCron = () => {
    cron.schedule("*/1 * * * *", async () => {
        try {
            // 1. Move UPCOMING to ACTIVE
            const now = new Date();
            // Only find auctions that are 'Upcoming' AND start time has passed
            // Note: We need to be careful about string vs Date optimization depending on schema
            // The schema says startTime is "String", which is bad design (Senior Eng Note).
            // But we must work with it. Ideally we refactor schema to Date. 
            // Assuming ISO string comparison works for now, or we fetch & filter.

            const auctions = await Auction.find({ status: "Upcoming" });

            for (const auction of auctions) {
                const start = new Date(auction.startTime);
                if (start <= now) {
                    auction.status = "Active";
                    await auction.save();
                    console.log(`Auction ${auction._id} is now ACTIVE`);
                }
            }

            // 2. Move ACTIVE to ENDED (Fallback for main cron)
            // The endedAuctionCron handles the complex logic (commission, emails)
            // We can leave that to the other cron, or double check here.
            // Let's stick to starting auctions here.

        } catch (error) {
            console.error("Error in verifyAuctionCron:", error);
        }
    });
};
