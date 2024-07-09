import { configureStore } from "@reduxjs/toolkit";
import menuSlice from "./slice/menuSlice";
import userSlice from "./slice/userSlice";
import globalLoadingSlice from "./slice/globalLoadingSlice";
import menuIsCollapseSlice from "./slice/menuIsCollapseSlice";
export const store = configureStore({
  reducer: {
    menuSlice: menuSlice,
    userSlice: userSlice,
    globalLoadingSlice: globalLoadingSlice,
    menuIsCollapseSlice: menuIsCollapseSlice
  }
});
