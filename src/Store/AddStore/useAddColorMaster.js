// store/useColorMaster.js
import { create } from "zustand";
import axios from "axios";
import {
  AddColorMasterAPI,
  // UpdateColorMasterAPI,
  DeleteColorMasterAPI,
  UpdateColorMasterAPI,
  // DeleteColorMasterAPI,
} from "../../Apis/MasterApis";

const useColorMaster = create((set, get) => ({
  colors: [],

  // Fetch States
  fetchIsLoading: false,
  fetchError: null,
  fetchIsSuccess: false,

  // Add States
  addIsLoading: false,
  addError: null,
  addIsSuccess: false,

  // Update States
  updateIsLoading: false,
  updateError: null,
  updateIsSuccess: false,

  // Delete States
  deleteIsLoading: false,
  deleteError: null,
  deleteIsSuccess: false,

  // Fetch all colors
  fetchColors: async () => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(AddColorMasterAPI);
      set({ colors: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch colors",
        fetchIsLoading: false,
      });
    }
  },

  // Add new color
  addColor: async (newColor) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddColorMasterAPI, newColor);
      await get().fetchColors();
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add color",
        addIsLoading: false,
      });
    }
  },

  // Update color
  // Update color
  updateColor: async (id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateColorMasterAPI}/${id}/`, updatedData); // ✅ include id and trailing slash
      await get().fetchColors();
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update color",
        updateIsLoading: false,
      });
    }
  },

  // Delete color
  deleteColor: async (id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteColorMasterAPI}/${id}/`); // ✅ include id and trailing slash
      await get().fetchColors();
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError: err.response?.data?.message || "Failed to delete color",
        deleteIsLoading: false,
      });
    }
  },

  // Clear all states (or you can make individual clear functions)
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
  clearDeleteState: () =>
    set({ deleteError: null, deleteIsSuccess: false, deleteIsLoading: false }),
}));

export default useColorMaster;
