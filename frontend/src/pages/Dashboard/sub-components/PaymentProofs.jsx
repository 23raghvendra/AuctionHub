import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaTrash, FaTimes } from "react-icons/fa";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="min-w-full bg-white">
          <thead className="bg-zinc-50">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">User ID</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => (
                <tr key={index} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-medium text-zinc-900">{element.userId}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${element.status === "Approved" ? "bg-green-100 text-green-800" :
                        element.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                      }`}>
                      {element.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      onClick={() => handleFetchPaymentDetail(element._id)}
                      title="View Details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      onClick={() => handlePaymentProofDelete(element._id)}
                      title="Delete"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-8 text-center text-zinc-500">
                  No payment proofs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
    </>
  );
};

export default PaymentProofs;

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector(
    (state) => state.superAdmin
  );
  const [amount, setAmount] = useState(singlePaymentProof.amount || "");
  const [status, setStatus] = useState(singlePaymentProof.status || "");

  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
  };

  return (
    <AnimatePresence>
      {openDrawer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenDrawer(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-zinc-900">Update Payment</h3>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <FaTimes className="text-zinc-500" />
              </button>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">User ID</label>
                <input
                  type="text"
                  value={singlePaymentProof.userId || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Settled">Settled</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Comment</label>
                <textarea
                  rows={4}
                  value={singlePaymentProof.comment || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-500"
                />
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  to={singlePaymentProof.proof?.url || ""}
                  target="_blank"
                  className="block w-full py-3 px-4 bg-zinc-900 text-white text-center font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  View Proof Screenshot
                </Link>

                <button
                  type="button"
                  onClick={handlePaymentProofUpdate}
                  className="block w-full py-3 px-4 bg-primary text-white text-center font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                >
                  {loading ? "Updating..." : "Update Status"}
                </button>

                <button
                  type="button"
                  onClick={() => setOpenDrawer(false)}
                  className="block w-full py-3 px-4 bg-white border border-zinc-200 text-zinc-700 text-center font-bold rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
