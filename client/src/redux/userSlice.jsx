import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch, unauthorizedResponse } from "../utils/auth";
import { toast } from "react-toastify";

const initialState = {
  userLoading: false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  isSidebarOpen: false,
  email: "",
  password: "",
  name: "",
  role: "",
  allUsers: [],
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const res = await authFetch.post("/user/login", user);
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/allUsers",
  async (_, thunkAPI) => {
    try {
      const res = await authFetch.get("/user/allUser");
      return res.data;
    } catch (error) {
      console.log(error);
      return unauthorizedResponse(error, thunkAPI);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    handleUser: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.user = payload.user;
        localStorage.setItem("user", JSON.stringify(payload.user));
        toast.success(payload.msg);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.userLoading = false;
        toast.error(payload);
      })
      .addCase(getAllUsers.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, { payload }) => {
        state.userLoading = false;
        state.allUsers = payload.users;
      });
  },
});

export const { toggleSidebar, handleUser } = userSlice.actions;

export default userSlice.reducer;
