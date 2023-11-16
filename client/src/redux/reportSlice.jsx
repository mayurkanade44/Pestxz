import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { authFetch, unauthorizedResponse } from "../utils/auth";

const initialState = {
  reportLoading: false,
  download: "",
  complaints: [],
};

export const addLocationRecord = createAsyncThunk(
  "user/addLocationRecord",
  async ({ id, form }, thunkAPI) => {
    try {
      const res = await authFetch.post(`/report/addRecord/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const createReport = createAsyncThunk(
  "user/createReport",
  async (
    { client, fromDate, toDate, subLocation, service, user },
    thunkAPI
  ) => {
    try {
      const res = await authFetch.get(
        `/report/allReports?shipTo=${client}&location=${subLocation}&fromDate=${fromDate}&toDate=${toDate}&serviceId=${service}&user=${user}`
      );
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const newComplaint = createAsyncThunk(
  "user/newComplaint",
  async ({ id, form }, thunkAPI) => {
    try {
      const res = await authFetch.post(`/report/newComplaint/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const allComplaints = createAsyncThunk(
  "user/allComplaints",
  async ({ client, status }, thunkAPI) => {
    try {
      const res = await authFetch.get(
        `/shipTo/complaints/all?client=${client}&status=${status}`
      );
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
  reduce: {
    clearReport: (state) => {
      state.reportLoading = false;
      state.download = "";
    },
  },
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
      })
      .addCase(createReport.pending, (state) => {
        state.reportLoading = true;
        state.download = "";
      })
      .addCase(createReport.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        state.download = payload.link;
        toast.success(payload.msg);
      })
      .addCase(createReport.rejected, (state, { payload }) => {
        state.reportLoading = false;
        toast.error(payload);
      })
      .addCase(newComplaint.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(newComplaint.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        toast.success(payload.msg);
      })
      .addCase(newComplaint.rejected, (state, { payload }) => {
        state.reportLoading = false;
        toast.error(payload);
      })
      .addCase(allComplaints.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(allComplaints.fulfilled, (state, { payload }) => {
        state.reportLoading = false;
        state.complaints = payload.complaints;
      })
      .addCase(allComplaints.rejected, (state, { payload }) => {
        state.reportLoading = false;
        toast.error(payload);
      });
  },
});

export const { clearReport } = reportSlice.actions;

export default reportSlice.reducer;
