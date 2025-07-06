import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface CompactMenuState {
  value: boolean;
}

const getCompactMenu = () => {
  return localStorage.getItem("compactMenu") === "false";
};

const initialState: CompactMenuState = {
  value: localStorage.getItem("compactMenu") === null ? false : getCompactMenu(),
};

export const compactMenuSlice = createSlice({
  name: "compactMenu",
  initialState,
  reducers: {
    setCompactMenu: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setCompactMenu } = compactMenuSlice.actions;

export const selectCompactMenu = (state: RootState) => {
  if (localStorage.getItem("compactMenu") === null) {
    localStorage.setItem("compactMenu", "false");
  }

  return state.compactMenu.value;
};

export default compactMenuSlice.reducer;
