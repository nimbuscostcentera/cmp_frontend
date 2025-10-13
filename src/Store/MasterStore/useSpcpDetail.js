// store/useSpcpDetails.js
import { create } from "zustand";
import axios from "axios";
import {
  AddSpcpMasterAPI,
  UpdateSpcpMasterAPI,
  DeleteSpcpMasterAPI,
} from "../../Apis/MasterApis";

const useSpcpDetails = create((set, get) => ({
  SpcpDetails: [], // generic array for any Spcp Details

  // Fetch States
  fetchDetailsIsLoading: false,
  fetchDetailsError: null,
  fetchDetailsIsSuccess: false,

  // Add States
  addDetailsIsLoading: false,
  addDetailsError: null,
  addDetailsIsSuccess: false,

  // Update States
  updateDetailsIsLoading: false,
  updateDetailsError: null,
  updateDetailsIsSuccess: false,

  // Delete States
  deleteDetailsIsLoading: false,
  deleteDetailsError: null,
  deleteDetailsIsSuccess: false,

  // ✅ Fetch all SpcpDetails items
  fetchSpcpDetails: async (type, ID_Header) => {
    set({
      fetchDetailsIsLoading: true,
      fetchDetailsError: null,
      fetchDetailsIsSuccess: false,
    });
    try {
      const res = await axios.get(
        `${AddSpcpMasterAPI}?type=${type}${
          ID_Header ? `&ID_Header=${ID_Header}` : ""
        }`
      );
      set({
        SpcpDetails: res.data,
        fetchDetailsIsLoading: false,
        fetchDetailsIsSuccess: true,
      });
    } catch (err) {
      set({
        fetchDetailsError:
          err.response?.data?.message || "Failed to fetch details",
        fetchDetailsIsLoading: false,
      });
    }
  },

  // ✅ Add new SpcpDetails
  addSpcpDetails: async (type, newItem, ID_Header) => {
    set({
      addDetailsIsLoading: true,
      addDetailsError: null,
      addDetailsIsSuccess: false,
    });
    try {

      await axios.post(AddSpcpMasterAPI, { ...newItem, type, ID_Header });
      set({ addDetailsIsSuccess: true, addDetailsIsLoading: false });
    } catch (err) {
      set({
        addDetailsError: err.response?.data?.message || "Failed to add details",
        addDetailsIsLoading: false,
      });
    }
  },

  // ✅ Update SpcpDetails
  updateSpcpDetails: async (type, id, updatedData) => {
    set({
      updateDetailsIsLoading: true,
      updateDetailsError: null,
      updateDetailsIsSuccess: false,
    });
    try {
      await axios.put(`${UpdateSpcpMasterAPI}/${id}/`, {
        ...updatedData,
        type,
      });
      set({ updateDetailsIsSuccess: true, updateDetailsIsLoading: false });
    } catch (err) {
      set({
        updateDetailsError:
          err.response?.data?.message || "Failed to update details",
        updateDetailsIsLoading: false,
      });
    }
  },

  // ✅ Delete SpcpDetails
  deleteSpcpDetails: async (type = "prm", id) => {
    set({
      deleteDetailsIsLoading: true,
      deleteDetailsError: null,
      deleteDetailsIsSuccess: false,
    });
    try {
      await axios.delete(`${DeleteSpcpMasterAPI}/${id}/?type=${type}`);
      set({ deleteDetailsIsSuccess: true, deleteDetailsIsLoading: false });
    } catch (err) {
      set({
        deleteDetailsError:
          err.response?.data?.message || "Failed to delete details",
        deleteDetailsIsLoading: false,
      });
    }
  },

  // ✅ Clear States
  clearFetchDetailsState: () =>
    set({
      fetchDetailsError: null,
      fetchDetailsIsSuccess: false,
      fetchDetailsIsLoading: false,
    }),

  clearAddDetailsState: () =>
    set({
      addDetailsError: null,
      addDetailsIsSuccess: false,
      addDetailsIsLoading: false,
    }),

  clearUpdateDetailsState: () =>
    set({
      updateDetailsError: null,
      updateDetailsIsSuccess: false,
      updateDetailsIsLoading: false,
    }),

  clearDeleteDetailsState: () =>
    set({
      deleteDetailsError: null,
      deleteDetailsIsSuccess: false,
      deleteDetailsIsLoading: false,
    }),
}));

export default useSpcpDetails;
