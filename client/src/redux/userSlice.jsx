import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userLoading: false,
  isSidebarOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
  extraReducers: (builder) => {},
});

export const { toggleSidebar } = userSlice.actions;

export default userSlice.reducer;
