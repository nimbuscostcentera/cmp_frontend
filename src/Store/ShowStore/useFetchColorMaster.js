import { create } from "zustand";
import useAddColorMaster from "../AddStore/useAddColorMaster";

const useFetchColorMaster = create((set) => ({
  ColorMasterList: [],
  isColorMasterLoading: false,

  fetchColorMaster: () => {
    set({ isColorMasterLoading: true });

    setTimeout(() => {
      // Pull directly from AddStore (single source of truth)
      const colors = useAddColorMaster.getState().colors;
      set({ ColorMasterList: colors, isColorMasterLoading: false });
    }, 400);
  },
}));

export default useFetchColorMaster;
