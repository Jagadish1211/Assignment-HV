import { createSlice } from "@reduxjs/toolkit";

export const tabViewsSlice = createSlice({
  name: "tabViews",

  // possible values for the tab views
  // Platform and Schedule Input
  // Platforms
  // Dashboard

  initialState: {
    activeTabView: "Platform and Schedule Input",
  },

  reducers: {
    selectTabView: (state, action) => {
      state.activeTabView = action.payload;
    },
  },
});

export const { selectTabView } = tabViewsSlice.actions;

export const selectCount = (state) => state.tabViews.value;

export default tabViewsSlice.reducer;
