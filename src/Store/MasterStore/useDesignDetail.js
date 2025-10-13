import { create } from "zustand";
import axios from "axios";
import {
  AddDesignMasterAPI,
  UpdateDesignMasterAPI,
  DeleteDesignMasterAPI,
} from "../../Apis/MasterApis";

const useDesignDetail = create((set, get) => ({
  DesignDetail: [],

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
  // FETCH DesignDetail LIST
  // =====================================================
  fetchDesignDetail: async (type, ID_Header) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(
        `${AddDesignMasterAPI}?type=${type}${
          ID_Header ? `&ID_Header=${ID_Header}` : ""
        }`
      );
      set({
        DesignDetail: res.data,
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

  // ✅ Add new DesignDetails
  addDesignDetail: async (type, newItem, ID_Header) => {
    set({
      addIsLoading: true,
      addError: null,
      addIsSuccess: false,
    });
    try {
      await axios.post(AddDesignMasterAPI, { data : newItem, type, ID_Header });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add details",
        addIsLoading: false,
      });
    }
  },

  // =====================================================
  // UPDATE DesignDetail (FormData)
  // =====================================================
  updateDesignDetail: async (type, id, data) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      const payload = { ...data, type };
      await axios.put(`${UpdateDesignMasterAPI}/${id}/`, payload, {
        headers: { "Content-Type": "application/json" },
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
  // DELETE DesignDetail
  // =====================================================
  deleteDesignDetail: async (type = "prm", id) => {
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

export default useDesignDetail;
