import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuctionDetail } from "./auctionSlice";
import { API_BASE_URL } from "@/config/api";

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
    wonItems: [],
  },
  reducers: {
    bidRequest(state, action) {
      state.loading = true;
    },
    bidSuccess(state, action) {
      state.loading = false;
    },
    bidFailed(state, action) {
      state.loading = false;
    },
    getWonItemsRequest(state) {
      state.loading = true;
    },
    getWonItemsSuccess(state, action) {
      state.loading = false;
      state.wonItems = action.payload;
    },
    getWonItemsFailed(state) {
      state.loading = false;
      state.wonItems = [];
    }
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.bidRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/bid/place/${id}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(bidSlice.actions.bidSuccess());
    toast.success(response.data.message);
    dispatch(getAuctionDetail(id))
  } catch (error) {
    dispatch(bidSlice.actions.bidFailed());
    toast.error(error.response.data.message);
  }
};

export const getUserWonItems = () => async (dispatch) => {
  dispatch(bidSlice.actions.getWonItemsRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/bid/won-items`, {
      withCredentials: true,
    });
    dispatch(bidSlice.actions.getWonItemsSuccess(response.data.items));
  } catch (error) {
    dispatch(bidSlice.actions.getWonItemsFailed());
    console.error(error);
  }
};

export default bidSlice.reducer;