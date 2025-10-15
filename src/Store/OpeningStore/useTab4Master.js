// store/useTab4Master.js
import { create } from "zustand";
import axios from "axios";
import {
  AddTab4MasterAPI,
  UpdateTab4MasterAPI,
  DeleteTab4MasterAPI,
} from "../../Apis/OpeningApis";

const useTab4Master = create((set) => ({
  tab4Data: [], // Holds Tab4 master data

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

  // ✅ Fetch all Tab4 items
  fetchTab4: async (type) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(`${AddTab4MasterAPI}?type=${type}`);
      set({ tab4Data: res.data, fetchIsLoading: false, fetchIsSuccess: true });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch Tab4 items",
        fetchIsLoading: false,
      });
    }
  },

  // ✅ Add new Tab4 item
  addTab4: async (type, newItem) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddTab4MasterAPI, { ...newItem, type });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add Tab4 item",
        addIsLoading: false,
      });
    }
  },

  // ✅ Update Tab4 item
  updateTab4: async (type, id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${UpdateTab4MasterAPI}/${id}/`, {
        ...updatedData,
        type,
      });
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError:
          err.response?.data?.message || "Failed to update Tab4 item",
        updateIsLoading: false,
      });
    }
  },

  // ✅ Delete Tab4 item
  deleteTab4: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteTab4MasterAPI}/${id}/?type=${type}`);
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError:
          err.response?.data?.message || "Failed to delete Tab4 item",
        deleteIsLoading: false,
      });
    }
  },

  // ✅ Clear States
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
  clearDeleteState: () =>
    set({ deleteError: null, deleteIsSuccess: false, deleteIsLoading: false }),
}));

export default useTab4Master;
