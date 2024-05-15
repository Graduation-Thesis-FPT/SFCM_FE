import { configureStore } from "@reduxjs/toolkit";
import menuSlice from "./slice/menuSlice";
import userSlice from "./slice/userSlice";
export const store = configureStore({
  reducer: {
    menuSlice: menuSlice,
    userSlice: userSlice
  }
});
