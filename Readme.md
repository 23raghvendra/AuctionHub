# AuctionHub

*Fully functional online auction platform*

---

## Table of Contents

* [Overview](#overview)
* [Problem Statement](#problem-statement)
* [Key Features](#key-features)
* [System Architecture](#system-architecture)
* [Frontend Pages & Routing](#frontend-pages--routing)
* [Tech Stack](#tech-stack)
* [API Overview (Summary)](#api-overview-summary)
* [Deployment & Hosting](#deployment--hosting)
* [How to Run (Dev)](#how-to-run-dev)
* [Contributing](#contributing)
* [Contact](#contact)

---

## Overview

AuctionHub is a modern online auction platform that connects buyers and sellers in a secure, real-time marketplace. It offers auction creation, competitive bidding with live updates, commission management, and an admin dashboard for verification and analytics.

## Problem Statement

Traditional auction workflows often lack centralized automation, transparent real-time bidding, and integrated payment verification. AuctionHub addresses these gaps by providing:

* Real-time bid updates
* Automated auction lifecycle management
* Built-in commission submission and verification for sellers
* Role-based dashboards for users and administrators

## Key Features

### Authentication & Authorization

* Email/password registration and login
* JWT-based sessions
* Role-based access control (User / Admin / Super Admin)

### Auction Management

* Create, read, update, delete (CRUD) auctions
* Auction metadata: title, description, start price, end date, images
* Seller dashboard to view and manage own auctions

### Bidding System

* Place validated bids (must exceed current highest bid)
* View complete bid history per auction
* Notifications for outbids and auction endings

### Commission Management

* Submit commission payment proofs
* Admin verification workflow with notes and status

### Dashboards & Analytics

* User dashboard (active bids, won auctions, stats)
* Admin dashboard (platform stats, user management, commission verification)
* Leaderboard of top bidders and most active users

### Advanced

* Real-time updates for live bidding
* Email notifications via NodeMailer
* Background tasks for ending auctions and processing commissions

## System Architecture

**Frontend Layer**

* React.js + React Router + Tailwind CSS
* Pages: Register, Login, Auctions, Bid details, Create Auction, Dashboard, Profile

**Backend Layer**

* Node.js + Express.js (REST API)
* Core models: User, Auction, Bid, Commission, CommissionProof
* Features: JWT auth, email notifications, task automation

**Database Layer**

* MongoDB (hosted on MongoDB Atlas)
* Collections: users, auctions, bids, commissions, etc.

## Frontend Pages & Routing

* `/` — Home (featured auctions, hero)
* `/register` — User registration
* `/login` — Login form
* `/auctions` — Browse auctions (search, filter, pagination)
* `/auction/:id` — Auction detail + bid history
* `/create-auction` — Create a listing
* `/my-auctions` — Seller's listings
* `/dashboard` — User dashboard
* `/leaderboard` — Top users
* `/submit-commission` — Upload commission proof
* `/profile` — Edit profile
* `/about`, `/how-it-works`, `/contact` — Informational pages

## Tech Stack

* Frontend: React.js, React Router v6, Tailwind CSS, Axios
* Backend: Node.js, Express.js, Mongoose
* Auth: JWT, bcryptjs
* Database: MongoDB Atlas
* Email: NodeMailer
* Deployment: Vercel / Netlify (frontend), Render / Railway (backend)

## API Overview (Summary)

### Authentication

* `POST /api/auth/register` — register new user
* `POST /api/auth/login` — login and receive token
* `POST /api/auth/logout` — clear session
* `GET /api/auth/profile` — current user profile

### User

* `GET /api/users/:id` — get user details
* `PUT /api/users/:id` — update profile
* `GET /api/users` — admin: list users

### Auctions

* `GET /api/auctions` — list auctions (query: page, limit, sort, search)
* `GET /api/auctions/:id` — auction details + bid history
* `POST /api/auctions` — create auction (auth)
* `PUT /api/auctions/:id` — update (auth)
* `DELETE /api/auctions/:id` — delete (admin or seller)
* `GET /api/auctions/seller/:id` — seller's auctions

### Bids

* `GET /api/bids/:auctionId` — list bids for auction
* `POST /api/bids` — place bid (auth)
* `DELETE /api/bids/:id` — cancel bid (auth)

### Commission

* `GET /api/commission/:userId` — get user's commissions
* `POST /api/commission/submit` — submit proof
* `PUT /api/commission/verify/:proofId` — admin verify proof
* `GET /api/commission/all` — admin: list commissions

### Admin

* `GET /api/admin/dashboard` — admin stats
* `GET /api/admin/users` — manage users
* `GET /api/admin/auctions` — manage auctions

## Deployment & Hosting

* Frontend: Vercel or Netlify
* Backend: Render or Railway
* Database: MongoDB Atlas

## How to Run (Dev)

1. Clone the repo
2. `cd backend` — install dependencies: `npm install`
3. Create a `.env` with necessary keys (MONGO_URI, JWT_SECRET, COOKIE_EXPIRE, etc.)
4. `npm run dev` to start backend (nodemon recommended)
5. `cd frontend` — `npm install` and `npm run dev` (or `npm start`)

> Make sure your `MONGO_URI` and other environment variables are strings and properly set to avoid mongoose `openUri()` errors.

## Contributing

Contributions are welcome — open issues for bugs and feature requests. Please follow standard Git workflow: fork, branch, PR.

## License

This repository is available under the MIT License unless specified otherwise.

## Contact

Project owner / maintainer: AuctionHub team

---

*This README was generated from the uploaded project proposal.*
