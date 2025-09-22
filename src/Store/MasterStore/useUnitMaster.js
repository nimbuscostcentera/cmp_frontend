// store/useUnitMaster.js
import { create } from "zustand";
import axios from "axios";
import {
  AddUnitMasterAPI,
  UpdateUnitMasterAPI,
  DeleteUnitMasterAPI,
} from "../../Apis/MasterApis";

const useUnitMaster = create((set, get) => ({
  units: [],

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

  // Fetch all units
  fetchUnits: async () => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(AddUnitMasterAPI);
      set({ units: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch units",
        fetchIsLoading: false,
      });
    }
  },

  // Add new unit
  addUnit: async (newUnit) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddUnitMasterAPI, newUnit);
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add unit",
        addIsLoading: false,
      });
    }
  },

  // Update unit
  updateUnit: async (id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateUnitMasterAPI}/${id}/`, updatedData); // ✅ include id and trailing slash
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update unit",
        updateIsLoading: false,
      });
    }
  },

  // Delete unit
  deleteUnit: async (id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteUnitMasterAPI}/${id}/`); // ✅ include id and trailing slash
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError: err.response?.data?.message || "Failed to delete unit",
        deleteIsLoading: false,
      });
    }
  },

  // Clear all states
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
  clearDeleteState: () =>
    set({ deleteError: null, deleteIsSuccess: false, deleteIsLoading: false }),
}));

export default useUnitMaster;
