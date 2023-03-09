import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./adminSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
  },
});
