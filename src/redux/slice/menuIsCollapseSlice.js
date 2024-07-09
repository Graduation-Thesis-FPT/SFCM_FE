import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuIsCollapse: false
};

export const menuIsCollapseSlice = createSlice({
  name: "menuIsCollapse",
  initialState,
  reducers: {
    setMenuIsCollapse: (state, action) => {
      state.menuIsCollapse = action.payload;
    }
  }
});

export const { setMenuIsCollapse } = menuIsCollapseSlice.actions;

export default menuIsCollapseSlice.reducer;
