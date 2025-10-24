import { create } from "zustand";
import axios from "axios";
import { AddMappingTcAPI, UpdateMappingTcAPI } from "../../Apis/MasterApis";

const useMappingTc = create((set) => ({
  mappingTc: [],

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

  // =====================================================
  // FETCH ALL MappingTC
  // =====================================================
  fetchMappingTc: async () => {
    set({ fetchIsLoading: true, fetchError: null, fetchIsSuccess: false });
    try {
      const res = await axios.get(AddMappingTcAPI);
      set({
        mappingTc: res.data,
        fetchIsLoading: false,
        fetchIsSuccess: true,
      });
      return res.data;
    } catch (err) {
      set({
        fetchError:
          err.response?.data?.message || "Failed to fetch MappingTC records",
        fetchIsLoading: false,
      });
    }
  },



  // =====================================================
  // UPDATE MappingTC (no ID in URL, hits UpdatePrefixVoucherView)
  // =====================================================
  updateMappingTc: async (updatedList) => {
    // expected format: [{ Tc: 'OPE', Pvoucher: 'ORD' }, { Tc: 'BIL', Pvoucher: 'BILL' }]
    set({ updateIsLoading: true, updateError: null, updateIsSuccess: false });
    try {
      await axios.post(UpdateMappingTcAPI, updatedList);
      set({ updateIsSuccess: true, updateIsLoading: false });
    } catch (err) {
      set({
        updateError:
          err.response?.data?.message || "Failed to update MappingTC records",
        updateIsLoading: false,
      });
    }
  },

  // =====================================================
  // CLEAR STATES
  // =====================================================
  clearFetchState: () =>
    set({ fetchError: null, fetchIsSuccess: false, fetchIsLoading: false }),
  clearAddState: () =>
    set({ addError: null, addIsSuccess: false, addIsLoading: false }),
  clearUpdateState: () =>
    set({ updateError: null, updateIsSuccess: false, updateIsLoading: false }),
}));

export default useMappingTc;
