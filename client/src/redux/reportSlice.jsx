import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { authFetch, unauthorizedResponse } from "../utils/auth";

const initialState = {
  reportLoading: false,
  download: "",
};

export const addLocationRecord = createAsyncThunk(
  "user/addLocationRecord",
  async ({ id, reportData }, thunkAPI) => {
    try {
      const res = await authFetch.post(`/report/addRecord/${id}`, {
        reportData,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reduce: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLocationRecord.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(addLocationRecord.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        toast.success(payload.msg);
      })
      .addCase(addLocationRecord.rejected, (state, { payload }) => {
        state.reportLoading = false;
        toast.error(payload);
      });
  },
});

export default reportSlice.reducer;
