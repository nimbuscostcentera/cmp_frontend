// store/useLayout1Master.js
import { create } from "zustand";
import axios from "axios";
import {
  AddLayout1MasterAPI,
  UpdateLayout1MasterAPI,
  DeleteLayout1MasterAPI,
} from "../../Apis/MasterApis";

const useLayout1Master = create((set, get) => ({
  layout1: [], // generic array for any layout1 master


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

  // Fetch all layout1 items
  fetchLayout1: async (type) => {
 
    
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(`${AddLayout1MasterAPI}?type=${type}`); // type passed to API
      set({ layout1: res.data, fetchIsLoading: false, fetchIsSuccess: true });
      return res.data;
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch items",
        fetchIsLoading: false,
      });
    }
  },

  // Add new item
  addLayout1: async (type, newItem) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    // console.log(newItem);
    try {
      console.log(type);
      await axios.post(AddLayout1MasterAPI, { ...newItem, type });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add item",
        addIsLoading: false,
      });
    }
  },

  // Update item
  updateLayout1: async (type, id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateLayout1MasterAPI}/${id}/`,{ ...updatedData, type });
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update item",
        updateIsLoading: false,
      });
    }
  },

  // Delete item
  deleteLayout1: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteLayout1MasterAPI}/${id}/?type=${type}`);
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

export default useLayout1Master;
