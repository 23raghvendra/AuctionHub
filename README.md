# 🛒 AuctionHub - Premium Online Auction Platform

AuctionHub is a feature-rich, real-time online auction platform built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to list items for auction, place real-time bids, and manage their sales. It features a comprehensive dashboard for users and a powerful admin panel for platform management.

## 🚀 Features

- **Real-Time Bidding**: Instant bid updates using Socket.io.
- **User Roles**: Separate interfaces for Bidders, Auctioneers, and Super Admins.
- **Auction Management**: Create, edit, republish, and delete auction listings.
- **Automated Workflow**:
  - Auto-start and auto-end auctions based on schedule.
  - Commission calculation and verification system.
  - Automatic email notifications for auction wins.
- **Financials**:
  - Payment proof submission and verification.
  - Monthly revenue tracking for Admins.
  - Leaderboard for top bidders and auctioneers.
- **Secure & Robust**:
  - JWT Authentication (HttpOnly Cookies).
  - Secure image uploads via Cloudinary.
  - Rate limiting and production-grade security headers (Helmet).

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Cloud Storage**: Cloudinary
- **Emails**: Nodemailer
- **Scheduling**: Node-Cron

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Gmail/SMTP Account

### 1. Clone the Repository
```bash
git clone https://github.com/23raghvendra/AuctionHub.git
cd AuctionHub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**Configure Environment Variables:**
Rename `config/.env.example` to `config/config.env` and update the values:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
JWT_SECRET_KEY=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_MAIL=your_email
SMTP_PASSWORD=your_app_password
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `frontend` directory (copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5001
```

Start the frontend:
```bash
npm run dev
```

## 📦 Deployment

### Backend (Render/Heroku/Railway)
1. Push the code to GitHub.
2. Connect your repository to Render.
3. Set the `Root Directory` to `backend`.
4. Add all environment variables from `config.env` to the deployment platform.
5. **Important**: Set `FRONTEND_URL` to your production frontend domain.

### Frontend (Vercel/Netlify)
1. Push the code to GitHub.
2. Connect your repository to Vercel.
3. Set the `Root Directory` to `frontend`.
4. Add `VITE_API_BASE_URL` to the environment variables (e.g., `https://your-backend.onrender.com`).

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License
This project is licensed under the MIT License.
