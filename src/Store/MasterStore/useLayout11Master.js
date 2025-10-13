// store/useUnitMaster.js
import { create } from "zustand";
import axios from "axios";
import {
  AddLayout11MasterAPI,
  UpdateLayout11MasterAPI,
  DeleteLayout11MasterAPI,
} from "../../Apis/MasterApis";

const useLayout11Master = create((set, get) => ({
  layout11: [],

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

  // Fetch all layout11 (type passed so same API endpoint can serve multiple masters)
  // signature: fetchLayout11(type)
  fetchLayout11: async (type) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      // append type as a query param so backend can handle different masters without changing endpoints
      const res = await axios.get(`${AddLayout11MasterAPI}?type=${encodeURIComponent(type)}`);
      // keep original console for debugging
      console.log(res.data);
      set({ layout11: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch layout11",
        fetchIsLoading: false,
      });
    }
  },

  // Add new unit
  // signature: addLayout11(type, newUnit)
  addLayout11: async (type, newUnit) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(`${AddLayout11MasterAPI}?type=${encodeURIComponent(type)}`, newUnit);
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add unit",
        addIsLoading: false,
      });
    }
  },

  // Update
  // signature: updateLayout11(type, id, updatedData)
  updateLayout11: async (type, id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateLayout11MasterAPI}/${id}/?type=${encodeURIComponent(type)}`, updatedData);
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update unit",
        updateIsLoading: false,
      });
    }
  },

  // Delete
  // signature: deleteLayout11(type, id)
  deleteLayout11: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteLayout11MasterAPI}/${id}/?type=${encodeURIComponent(type)}`);
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

export default useLayout11Master;
