import React, { useState } from "react";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaShoppingBag, FaHistory } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SideDrawer = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setShow(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
          ? "bg-primary text-white shadow-lg shadow-primary/30"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-primary"
          }`}
      >
        <Icon className={`text-xl ${isActive ? "text-white" : "text-zinc-400 group-hover:text-primary"}`} />
        <span className="font-semibold">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-primary text-white text-2xl p-3 rounded-full hover:bg-primary/90 lg:hidden z-50 shadow-lg cursor-pointer transition-transform active:scale-95"
      >
        <GiHamburgerMenu />
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-zinc-100 flex flex-col ${show ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100">
          <Link to="/" onClick={() => setShow(false)}>
            <h4 className="text-2xl font-black tracking-tight text-zinc-900">
              Prime<span className="text-primary">Bid</span>
            </h4>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="space-y-1">
            <NavLink to="/auctions" icon={RiAuctionFill} label="Auctions" />
            <NavLink to="/leaderboard" icon={MdLeaderboard} label="Leaderboard" />
          </div>

          {isAuthenticated && user?.role === "Auctioneer" && (
            <div className="mt-8">
              <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Auctioneer</p>
              <div className="space-y-1">
                <NavLink to="/submit-commission" icon={FaFileInvoiceDollar} label="Submit Commission" />
                <NavLink to="/create-auction" icon={IoIosCreate} label="Create Auction" />
                <NavLink to="/view-my-auctions" icon={FaEye} label="My Auctions" />
                <NavLink to="/view-past-auctions" icon={FaHistory} label="Past Auctions" />
              </div>
            </div>
          )}

          {isAuthenticated && user?.role === "Bidder" && (
            <div className="mt-8">
              <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Bidder</p>
              <div className="space-y-1">
                <NavLink to="/purchased-items" icon={FaShoppingBag} label="Purchased Items" />
              </div>
            </div>
          )}

          {isAuthenticated && user?.role === "Super Admin" && (
            <div className="mt-8">
              <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Admin</p>
              <NavLink to="/dashboard" icon={MdDashboard} label="Dashboard" />
            </div>
          )}

          <div className="mt-8">
            <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Support</p>
            <div className="space-y-1">
              <NavLink to="/how-it-works-info" icon={SiGooglesearchconsole} label="How it Works" />
              <NavLink to="/about" icon={BsFillInfoSquareFill} label="About Us" />
            </div>
          </div>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
          {!isAuthenticated ? (
            <div className="flex gap-3">
              <Link
                to="/sign-up"
                onClick={() => setShow(false)}
                className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-center text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setShow(false)}
                className="flex-1 bg-white text-zinc-700 border border-zinc-200 font-bold py-2.5 rounded-xl text-center text-sm hover:bg-zinc-50 transition-colors"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaUserCircle className="text-2xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 truncate">{user?.userName}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/me"
                  onClick={() => setShow(false)}
                  className="bg-white border border-zinc-200 text-zinc-700 font-semibold py-2 rounded-lg text-xs text-center hover:bg-zinc-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 font-semibold py-2 rounded-lg text-xs hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between items-center px-2">

            <p className="text-[10px] text-zinc-400 font-medium">© 2024 PrimeBid</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
