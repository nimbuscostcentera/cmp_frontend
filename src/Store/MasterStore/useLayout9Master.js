// store/useUnitMaster.js
import { create } from "zustand";
import axios from "axios";
import {
  AddUnitMasterAPI,
  UpdateUnitMasterAPI,
  DeleteUnitMasterAPI,
} from "../../Apis/MasterApis";

const useLayout9Master = create((set, get) => ({
  layout9: [],

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

  // Fetch all layout9 (type passed so same API endpoint can serve multiple masters)
  // signature: fetchLayout9(type)
  fetchLayout9: async (type) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      // append type as a query param so backend can handle different masters without changing endpoints
      const res = await axios.get(`${AddUnitMasterAPI}?type=${encodeURIComponent(type)}`);
      // keep original console for debugging
      console.log(res.data);
      set({ layout9: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch layout9",
        fetchIsLoading: false,
      });
    }
  },

  // Add new unit
  // signature: addLayout9(type, newUnit)
  addLayout9: async (type, newUnit) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(`${AddUnitMasterAPI}?type=${encodeURIComponent(type)}`, newUnit);
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add unit",
        addIsLoading: false,
      });
    }
  },

  // Update
  // signature: updateLayout9(type, id, updatedData)
  updateLayout9: async (type, id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateUnitMasterAPI}/${id}/?type=${encodeURIComponent(type)}`, updatedData);
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update unit",
        updateIsLoading: false,
      });
    }
  },

  // Delete
  // signature: deleteLayout9(type, id)
  deleteLayout9: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteUnitMasterAPI}/${id}/?type=${encodeURIComponent(type)}`);
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

export default useLayout9Master;
