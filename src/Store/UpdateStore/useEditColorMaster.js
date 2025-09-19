import { create } from "zustand";
import useAddColorMaster from "../AddStore/useAddColorMaster";

const useEditColorMaster = create((set) => ({
  ColorMasterEditSuccess: false,
  ColorMasterEditError: null,

  EditColorMasterFunc: (updatedColor) => {
    const { colors } = useAddColorMaster.getState();

    const index = colors.findIndex((c) => c.id === updatedColor.id);
    if (index === -1) {
      set({ ColorMasterEditError: "Color not found" });
      return;
    }

    const updatedList = [...colors];
    updatedList[index] = { ...colors[index], ...updatedColor };

    useAddColorMaster.setState({ colors: updatedList });
    set({ ColorMasterEditSuccess: true });
  },

  ClearStateEditColorMaster: () =>
    set({ ColorMasterEditSuccess: false, ColorMasterEditError: null }),
}));

export default useEditColorMaster;
