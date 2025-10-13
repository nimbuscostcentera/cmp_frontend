// store/useSpcpMaster.js
import { create } from "zustand";
import axios from "axios";
import {
  AddSpcpMasterAPI,
  UpdateSpcpMasterAPI,
  DeleteSpcpMasterAPI,
} from "../../Apis/MasterApis";

const useSpcpMaster = create((set, get) => ({
  Spcp: [], // generic array for any Spcp master

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

  // Fetch all Spcp items
  fetchSpcp: async (type ) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(`${AddSpcpMasterAPI}?type=${type}`); // type passed to API
      set({ Spcp: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch items",
        fetchIsLoading: false,
      });
    }
  },

  // Add new item
  addSpcp: async (type , newItem) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddSpcpMasterAPI, { ...newItem, type });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add item",
        addIsLoading: false,
      });
    }
  },

  // Update item
  updateSpcp: async (type , id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateSpcpMasterAPI}/${id}/`, {
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
  deleteSpcp: async (type = "prm", id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteSpcpMasterAPI}/${id}/?type=${type}`);
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

export default useSpcpMaster;
