import { deleteAuctionItem } from "@/store/slices/superAdminSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";

const AuctionItemDelete = () => {
  const { allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  const handleAuctionDelete = (id) => {
    dispatch(deleteAuctionItem(id));
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-100">
      <table className="min-w-full bg-white">
        <thead className="bg-zinc-50">
          <tr>
            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Item</th>
            <th className="py-4 px-6 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Title</th>
            <th className="py-4 px-6 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {allAuctions.length > 0 ? (
            allAuctions.map((element) => (
              <tr key={element._id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4 px-6">
                  <img
                    src={element.image?.url}
                    alt={element.title}
                    className="h-12 w-12 object-cover rounded-lg border border-zinc-200"
                  />
                </td>
                <td className="py-4 px-6 text-sm font-medium text-zinc-900">{element.title}</td>
                <td className="py-4 px-6 text-right space-x-2">
                  <Link
                    to={`/auction/item/${element._id}`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="View Item"
                  >
                    <FaEye className="w-4 h-4" />
                  </Link>
                  <button
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    onClick={() => handleAuctionDelete(element._id)}
                    title="Delete Item"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-8 text-center text-zinc-500">
                No auctions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionItemDelete;
