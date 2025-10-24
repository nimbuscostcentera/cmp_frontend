// store/useSetupStore.js
import { create } from "zustand";
import axios from "axios";
import {
 ADDSETUPAPI,EDITSETUPAPI,DELETESETUPAPI
} from "../../Apis/SetupApis";

const useSetupStore = create((set) => ({
  setupData: null,

  // Fetch states
  fetchIsLoading: false,
  fetchError: null,
  fetchIsSuccess: false,

  // Add states
  addIsLoading: false,
  addError: null,
  addIsSuccess: false,

  // Update states
  updateIsLoading: false,
  updateError: null,
  updateIsSuccess: false,

  // Delete states
  deleteIsLoading: false,
  deleteError: null,
  deleteIsSuccess: false,

  // ✅ Fetch setup info
  fetchSetup: async () => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(ADDSETUPAPI);
      if (Array.isArray(res.data) && res.data.length > 0) {
        set({
          setupData: res.data[0],
          fetchIsLoading: false,
          fetchIsSuccess: true,
        });
      } else {
        set({
          fetchError: "No setup data found",
          fetchIsLoading: false,
        });
      }
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch setup info",
        fetchIsLoading: false,
      });
    }
  },

  // ✅ Add new setup info
  addSetup: async (newSetup) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(ADDSETUPAPI, newSetup);
      set({ addIsLoading: false, addIsSuccess: true });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add setup info",
        addIsLoading: false,
      });
    }
  },

  // ✅ Update setup info
  updateSetup: async (id, updatedData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(`${EDITSETUPAPI}/${id}/`, updatedData);
      set({ updateIsLoading: false, updateIsSuccess: true });
    } catch (err) {
      set({
        updateError:
          err.response?.data?.message || "Failed to update setup info",
        updateIsLoading: false,
      });
    }
  },

  // ✅ Delete setup info
  deleteSetup: async (id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DELETESETUPAPI}/${id}/`);
      set({ deleteIsLoading: false, deleteIsSuccess: true });
    } catch (err) {
      set({
        deleteError:
          err.response?.data?.message || "Failed to delete setup info",
        deleteIsLoading: false,
      });
    }
  },

  // ✅ Clear states
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
  clearDeleteState: () =>
    set({ deleteError: null, deleteIsSuccess: false, deleteIsLoading: false }),
}));

export default useSetupStore;
