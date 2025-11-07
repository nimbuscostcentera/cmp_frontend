// store/useLayout3Master.js
import { create } from "zustand";
import axios from "axios";
import {
  AddLayout3MasterAPI,
  UpdateLayout3MasterAPI,
  DeleteLayout3MasterAPI,
} from "../../Apis/MasterApis";

const useLayout3Master = create((set, get) => ({
  layout3: [], // generic array for any layout3 master

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

  // Fetch all layout3 items
  fetchLayout3: async (type) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(`${AddLayout3MasterAPI}?type=${type}`); // type passed to API
      set({ layout3: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch items",
        fetchIsLoading: false,
      });
    }
  },

  // Add new item
  addLayout3: async (type, newItem) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddLayout3MasterAPI, { ...newItem, type });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      let errorMsg = "Failed to add item";

      const data = err.response?.data;

      if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        const firstVal = data[firstKey];

        if (Array.isArray(firstVal) && firstVal.length > 0) {
          errorMsg = firstVal[0]; // "unit master
        }
      }

      set({
        addError: errorMsg,
        addIsLoading: false,
      });
    }
  },

  // Update item
  updateLayout3: async (type, id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateLayout3MasterAPI}/${id}/`, {
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
  deleteLayout3: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteLayout3MasterAPI}/${id}/?type=${type}`);
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

export default useLayout3Master;
