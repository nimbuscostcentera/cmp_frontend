// store/useLayout2Master.js
import { create } from "zustand";
import axios from "axios";
import {
  AddLayout2MasterAPI,
  UpdateLayout2MasterAPI,
  DeleteLayout2MasterAPI
} from "../../Apis/MasterApis"; // single API endpoint

const useLayout2Master = create((set, get) => ({
  layout2: [],

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

  // Fetch all layout2 items
  fetchLayout2: async (type) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(`${AddLayout2MasterAPI}?type=${type}`);
      set({ layout2: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch data",
        fetchIsLoading: false,
      });
    }
  },

  // Add new item
  addLayout2: async (type, newData) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddLayout2MasterAPI, { ...newData, type });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add data",
        addIsLoading: false,
      });
    }
  },

  // Update item
  updateLayout2: async (type, id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateLayout2MasterAPI}/${id}/`, {
        ...updatedData,
        type,
      });
 
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update data",
        updateIsLoading: false,
      });
    }
  },

  // Delete item
  deleteLayout2: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteLayout2MasterAPI}/${id}/?type=${type}`, {
        data: { type },
      }); // send type in body
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError: err.response?.data?.message || "Failed to delete data",
        deleteIsLoading: false,
      });
    }
  },

  // Clear states
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
  clearDeleteState: () =>
    set({ deleteError: null, deleteIsSuccess: false, deleteIsLoading: false }),
}));

export default useLayout2Master;
