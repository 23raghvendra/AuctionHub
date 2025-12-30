import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated, navigateTo]);

  const DetailItem = ({ label, value }) => (
    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <p className="text-zinc-900 font-semibold truncate" title={value}>{value || "N/A"}</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-zinc-50 lg:pl-[280px] py-12 px-6">
      {loading ? (
        <Spinner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          {/* Header Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={user.profileImage?.url}
                alt={user.userName}
                className="w-32 h-32 rounded-full object-cover border-4 border-zinc-50 shadow-lg"
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-black text-zinc-900 mb-1">{user.userName}</h1>
              <p className="text-zinc-500 font-medium mb-4">{user.email}</p>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Username" value={user.userName} />
                  <DetailItem label="Email" value={user.email} />
                  <DetailItem label="Phone" value={user.phone} />
                  <DetailItem label="Address" value={user.address} />
                  <DetailItem label="Role" value={user.role} />
                  <DetailItem label="Joined On" value={user.createdAt?.substring(0, 10)} />
                </div>
              </div>

              {user.role === "Auctioneer" && (
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Bank Name" value={user.paymentMethods.bankTransfer.bankName} />
                    <DetailItem label="Account Number" value={user.paymentMethods.bankTransfer.bankAccountNumber} />
                    <DetailItem label="Account Name" value={user.paymentMethods.bankTransfer.bankAccountName} />
                    <DetailItem label="Easypaisa" value={user.paymentMethods.easypaisa.easypaisaAccountNumber} />
                    <DetailItem label="PayPal" value={user.paymentMethods.paypal.paypalEmail} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Statistics</h3>
                <div className="space-y-4">
                  {user.role === "Auctioneer" && (
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                      <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-1">Unpaid Commission</p>
                      <p className="text-3xl font-black text-red-700">${user.unpaidCommission}</p>
                    </div>
                  )}
                  {user.role === "Bidder" && (
                    <>
                      <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <p className="text-green-600 text-sm font-bold uppercase tracking-wider mb-1">Auctions Won</p>
                        <p className="text-3xl font-black text-green-700">{user.auctionsWon}</p>
                      </div>
                      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-1">Total Spent</p>
                        <p className="text-3xl font-black text-blue-700">${user.moneySpent}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProfile;
