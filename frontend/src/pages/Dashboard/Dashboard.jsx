import {
  clearAllSuperAdminSliceErrors,
  getAllPaymentProofs,
  getAllUsers,
  getMonthlyRevenue,
} from "@/store/slices/superAdminSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuctionItemDelete from "./sub-components/AuctionItemDelete";
import BiddersAuctioneersGraph from "./sub-components/BiddersAuctioneersGraph";
import PaymentGraph from "./sub-components/PaymentGraph";
import PaymentProofs from "./sub-components/PaymentProofs";
import Spinner from "@/custom-components/Spinner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    dispatch(getMonthlyRevenue());
    dispatch(getAllUsers());
    dispatch(getAllPaymentProofs());
    dispatch(clearAllSuperAdminSliceErrors());
  }, [dispatch]);

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (user.role !== "Super Admin" || !isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, user.role, navigateTo]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full min-h-screen bg-zinc-50 lg:pl-[280px] py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-10"
          >
            <div className="mb-10">
              <h1 className="text-4xl font-black text-zinc-900 mb-2">Admin Dashboard</h1>
              <p className="text-zinc-500 text-lg">Overview of platform performance and management</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Revenue Overview</h3>
                <PaymentGraph />
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">User Growth</h3>
                <BiddersAuctioneersGraph />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Payment Proofs</h3>
              <PaymentProofs />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Manage Auctions</h3>
              <AuctionItemDelete />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
