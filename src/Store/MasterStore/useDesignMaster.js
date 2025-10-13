import { create } from "zustand";
import axios from "axios";
import {
  AddDesignMasterAPI,
  UpdateDesignMasterAPI,
  DeleteDesignMasterAPI,
} from "../../Apis/MasterApis";

const useDesignMaster = create((set, get) => ({
  Design: [],

  // --- FETCH STATES ---
  fetchIsLoading: false,
  fetchError: null,
  fetchIsSuccess: false,

  // --- ADD STATES ---
  addIsLoading: false,
  addError: null,
  addIsSuccess: false,

  // --- UPDATE STATES ---
  updateIsLoading: false,
  updateError: null,
  updateIsSuccess: false,

  // --- DELETE STATES ---
  deleteIsLoading: false,
  deleteError: null,
  deleteIsSuccess: false,

  // =====================================================
  // FETCH DESIGN LIST
  // =====================================================
  fetchDesign: async (type) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(`${AddDesignMasterAPI}?type=${type}`);
      set({
        Design: res.data,
        fetchIsLoading: false,
        fetchIsSuccess: true,
      });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch items",
        fetchIsLoading: false,
      });
    }
  },

  // =====================================================
  // ADD DESIGN (FormData)
  // =====================================================
  addDesign: async (type, formData) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      // Append type to FormData
      formData.append("type", type);

      await axios.post(AddDesignMasterAPI, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add item",
        addIsLoading: false,
      });
    }
  },

  // =====================================================
  // UPDATE DESIGN (FormData)
  // =====================================================
  updateDesign: async (type, id, formData) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      // Append type to FormData
      formData.append("type", type);

      await axios.put(`${UpdateDesignMasterAPI}/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update item",
        updateIsLoading: false,
      });
    }
  },

  // =====================================================
  // DELETE DESIGN
  // =====================================================
  deleteDesign: async (type = "prm", id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.delete(`${DeleteDesignMasterAPI}/${id}/?type=${type}`);
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError: err.response?.data?.message || "Failed to delete item",
        deleteIsLoading: false,
      });
    }
  },

  // =====================================================
  // CLEAR STATE METHODS
  // =====================================================
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
  clearDeleteState: () =>
    set({ deleteError: null, deleteIsSuccess: false, deleteIsLoading: false }),
}));

export default useDesignMaster;
