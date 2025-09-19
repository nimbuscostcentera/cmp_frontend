import { create } from "zustand";
import useAddColorMaster from "../AddStore/useAddColorMaster";

const useDeleteColorMaster = create((set) => ({
  ColorMasterDeleteMsg: null,
  ColorMasterDeleteErr: null,

  DeleteColorMaster: ({ id }) => {
    const { colors } = useAddColorMaster.getState();

    if (!colors.some((c) => c.id === id)) {
      set({ ColorMasterDeleteErr: "Color not found" });
      return;
    }

    const updatedList = colors.filter((c) => c.id !== id);
    useAddColorMaster.setState({ colors: updatedList });
    set({ ColorMasterDeleteMsg: "Color deleted successfully" });
  },

  ClearColorMasterDelete: () =>
    set({ ColorMasterDeleteMsg: null, ColorMasterDeleteErr: null }),
}));

export default useDeleteColorMaster;
