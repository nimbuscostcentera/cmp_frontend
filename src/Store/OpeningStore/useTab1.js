import { create } from "zustand";
import axios from "axios";
import {
  AddTab1OpeningAPI,
  UpdateTab1OpeningAPI,
  DeleteTab1OpeningAPI,
} from "../../Apis/OpeningApis";


const useTab1 = create((set, get) => ({
    tab1Data: [],

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
    // ==============================
    ///       Add Tab1 LIST          
    // ==============================
    addTab1: async (type, newItem) => {
        set({ addIsLoading: true, addError: false, addIsSuccess: false });
        try {
            await axios.post(AddTab1OpeningAPI, { ...newItem, type })
            set({ addIsSuccess: true, addIsLoading: false });
        } catch (error) {
            set({
                addError: error.response?.data?.message || "Failed to add item",
                addIsLoading: false,
            });
        }
    }
    

    

    

}));

export default useTab1;