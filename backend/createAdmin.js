import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config({ path: "./config/config.env" });

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "MERN_AUCTION_PLATFORM",
        });

        console.log("Connected to database");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@admin.com" });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            userName: "Admin User",
            email: "admin@admin.com",
            password: "admin123",
            phone: "12345678901",
            address: "Admin Office",
            role: "Auctioneer",
            profileImage: {
                public_id: "admin_profile",
                url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            },
            paymentMethods: {
                bankTransfer: {
                    bankAccountNumber: "1234567890",
                    bankAccountName: "Admin",
                    bankName: "Admin Bank",
                },
                easypaisa: {
                    easypaisaAccountNumber: "12345678901",
                },
                paypal: {
                    paypalEmail: "admin@paypal.com",
                },
            },
        });

        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@admin.com");
        console.log("Password: admin123");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdminUser();
