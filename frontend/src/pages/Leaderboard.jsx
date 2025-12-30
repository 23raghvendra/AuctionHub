import Spinner from "@/custom-components/Spinner";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const { loading, leaderboard } = useSelector((state) => state.user);

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
            className="max-w-7xl mx-auto"
          >
            <div className="mb-10">
              <h1 className="text-4xl font-black text-zinc-900 mb-2">Bidders Leaderboard</h1>
              <p className="text-zinc-500 text-lg">Top performers in our auction community</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-100">
                    <tr>
                      <th className="py-5 px-8 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Rank</th>
                      <th className="py-5 px-8 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">User</th>
                      <th className="py-5 px-8 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Bid Expenditure</th>
                      <th className="py-5 px-8 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Auctions Won</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {leaderboard.slice(0, 100).map((element, index) => (
                      <tr
                        key={element._id}
                        className="hover:bg-zinc-50/50 transition-colors group"
                      >
                        <td className="py-5 px-8">
                          <span className={`
                            inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                            ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-zinc-200 text-zinc-700' :
                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                  'text-zinc-500'}
                          `}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <img
                              src={element.profileImage?.url}
                              alt={element.username}
                              className="h-12 w-12 object-cover rounded-full border-2 border-white shadow-sm"
                            />
                            <span className="font-bold text-zinc-900">{element.userName}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right font-medium text-zinc-900">
                          ${element.moneySpent.toLocaleString()}
                        </td>
                        <td className="py-5 px-8 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {element.auctionsWon}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Leaderboard;
