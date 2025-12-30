import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const { leaderboard } = useSelector((state) => state.user);

  return (
    <section className="my-8">
      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
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
              {leaderboard.slice(0, 10).map((element, index) => (
                <motion.tr
                  key={element._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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
                        className="h-10 w-10 object-cover rounded-full border-2 border-white shadow-sm"
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
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/leaderboard"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-900 font-bold rounded-xl border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm"
        >
          View Full Leaderboard
        </Link>
      </div>
    </section>
  );
};

export default Leaderboard;
