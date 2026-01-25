import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  // Image is now optional
  let imageUploadResult = {
    public_id: "default_avatar",
    url: "https://res.cloudinary.com/demo/image/upload/v1574094077/face_top.jpg"
  };

  if (req.files && req.files.profileImage) {
    const { profileImage } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(profileImage.mimetype)) {
      return next(new ErrorHandler("File format not supported. Use PNG, JPEG or WEBP.", 400));
    }

    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        profileImage.tempFilePath,
        { folder: "MERN_AUCTION_PLATFORM_USERS" }
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown");
        return next(new ErrorHandler("Failed to upload profile image.", 500));
      }
      imageUploadResult = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url
      };
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return next(new ErrorHandler("Failed to upload profile image.", 500));
    }
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new ErrorHandler("Please fill full form.", 400));
  }
  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      return next(
        new ErrorHandler("Please provide your full bank details.", 400)
      );
    }
    if (!easypaisaAccountNumber) {
      return next(
        new ErrorHandler("Please provide your easypaisa account number.", 400)
      );
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please provide your paypal email.", 400));
    }
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: imageUploadResult,
    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      easypaisa: {
        easypaisaAccountNumber,
      },
      paypal: {
        paypalEmail,
      },
    },
  });
  generateToken(user, "User Registered.", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  console.log("=== LOGIN REQUEST ===");
  console.log("Request body:", req.body);
  console.log("Content-Type:", req.headers['content-type']);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Missing email or password");
    return next(new ErrorHandler("Please fill full form."));
  }

  console.log("Looking for user with email:", email);
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log("User not found");
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  console.log("User found:", user.email);
  const isPasswordMatch = await user.comparePassword(password);
  console.log("Password match:", isPasswordMatch);

  if (!isPasswordMatch) {
    console.log("Password does not match");
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  console.log("Login successful for:", user.email);
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const leaderboard = await User.find({ moneySpent: { $gt: 0 } })
    .sort({ moneySpent: -1 })
    .limit(100)
    .select('userName profileImage moneySpent auctionsWon');

  res.status(200).json({
    success: true,
    leaderboard,
  });
});
