// store/useLayout8Master.js
import { create } from "zustand";
import axios from "axios";
import {
  AddLayout12MasterAPI,
  UpdateLayout12MasterAPI,
  DeleteLayout12MasterAPI,
} from "../../Apis/MasterApis";

const useLayout12Master = create((set, get) => ({
  layout12: [], // generic array for any layout12 master

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

  // Fetch all layout12 items
  fetchLayout12: async (type) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(`${AddLayout12MasterAPI}?type=${type}`); // type passed to API
      set({ layout12: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch items",
        fetchIsLoading: false,
      });
    }
  },

  // Add new item
  addLayout12: async (type, newItem) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddLayout12MasterAPI, { ...newItem, type });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add item",
        addIsLoading: false,
      });
    }
  },

  // Update item
  updateLayout12: async (type, id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateLayout12MasterAPI}/${id}/`, {
        ...updatedData,
        type,
      });
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update item",
        updateIsLoading: false,
      });
    }
  },

  // Delete item
  deleteLayout12: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteLayout12MasterAPI}/${id}/?type=${type}`);
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError: err.response?.data?.message || "Failed to delete item",
        deleteIsLoading: false,
      });
    }
  },

  // Clear States
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
  clearDeleteState: () =>
    set({ deleteError: null, deleteIsSuccess: false, deleteIsLoading: false }),
}));

export default useLayout12Master;
