import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";
import { verifyAuctionCron } from "./automation/verifyAuctionCron.js";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();
config({
  path: "./config/config.env",
});

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  console.log(`[ORIGIN] ${req.headers.origin}`);
  next();
});

// Security & Performance Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean); // Remove undefined/null values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(null, false);
      }
    },
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/uploads", express.static("./uploads"));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 AuctionHub API is running!",
    version: "1.0.0",
    endpoints: {
      users: "/api/v1/user",
      auctions: "/api/v1/auctionitem",
      bids: "/api/v1/bid",
      commission: "/api/v1/commission",
      admin: "/api/v1/superadmin"
    }
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

endedAuctionCron();
verifyCommissionCron();
verifyAuctionCron();
connection();
app.use(errorMiddleware);

export default app;
