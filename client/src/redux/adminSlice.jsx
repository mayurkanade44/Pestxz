import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { authFetch, unauthorizedResponse } from "../utils/auth";

const initialState = {
  adminLoading: false,
  shipToName: "",
  shipToAddress: "",
  shipToEmail: "",
  shipToNumber: "",
  floor: "",
  location: "",
  client: {},
  redirect: false,
};

export const clientRegister = createAsyncThunk(
  "client/register",
  async (form, thunkAPI) => {
    try {
      const res = await authFetch.post("/shipTo/addShipTo", form);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    handleAdmin: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearAdminValues: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(clientRegister.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(clientRegister.fulfilled, (state, { payload }) => {
        state.adminLoading = false;
        state.client = payload.shipTo;
        state.redirect = true;
        toast.success(payload.msg);
      })
      .addCase(clientRegister.rejected, (state, { payload }) => {
        state.adminLoading = false;
        toast.error(payload);
      });
  },
});

export const { handleAdmin, clearAdminValues } = adminSlice.actions;

export default adminSlice.reducer;
