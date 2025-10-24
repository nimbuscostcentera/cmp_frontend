import { create } from "zustand";
import axios from "axios";
import {
  AddTab4MasterAPI,
  UpdateTab4MasterAPI,
  DeleteTab4MasterAPI,
} from "../../Apis/OpeningApis";

const useTab4ColorTable = create((set, get) => ({
  tab4ColorData: [],

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
  // FETCH Tab4Color LIST
  // =====================================================
  fetchTab4Color: async (type, ID_Header) => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(
        `${AddTab4MasterAPI}?type=${type}${
          ID_Header ? `&Header=${ID_Header}` : ""
        }`
      );
      set({
        tab4ColorData: res.data,
        fetchIsLoading: false,
        fetchIsSuccess: true,
      });
    } catch (err) {
      set({
        fetchError: err.response?.data?.message || "Failed to fetch Colors",
        fetchIsLoading: false,
      });
    }
  },

  // ✅ Add new Tab4Color rows
  addTab4Color: async (type, Header, newItems) => {
    set({ addIsLoading: true, addError: null, addIsSuccess: false });
    try {
      await axios.post(AddTab4MasterAPI, { Header, data: newItems, type });
      set({ addIsSuccess: true, addIsLoading: false });
    } catch (err) {
      set({
        addError: err.response?.data?.message || "Failed to add Colors",
        addIsLoading: false,
      });
    }
  },

  // =====================================================
  // UPDATE Tab4Color row
  // =====================================================
  updateTab4Color: async (type, id, payload) => {
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.put(
        `${UpdateTab4MasterAPI}/${id}/`,
        { ...payload, type },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError: err.response?.data?.message || "Failed to update Color",
        updateIsLoading: false,
      });
    }
  },

  // =====================================================
  // DELETE Tab4Color row
  // =====================================================
  deleteTab4Color: async (type, id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      // await axios.delete(`${DeleteTab4MasterAPI}/${id}/`);
      await axios.delete(`${DeleteTab4MasterAPI}/${id}/?type=${type}`);
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError: err.response?.data?.message || "Failed to delete Color",
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

export default useTab4ColorTable;
