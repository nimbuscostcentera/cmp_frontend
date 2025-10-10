import { create } from "zustand";
import axios from "axios";
import {
  LoginAPI,
  RegisterAPI,
  ShowUserAPI,
  EditUserAPI,
  DeleteUserAPI,
} from "../../Apis/AuthApis";

const useAuth = create((set, get) => ({
  // -------------------- States --------------------
  user: JSON.parse(localStorage.getItem("user")) || null, // persisted user
  userList: [],
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,

  // Login States
  loginIsLoading: false,
  loginError: null,
  loginIsSuccess: false,

  // Register States
  registerIsLoading: false,
  registerError: null,
  registerIsSuccess: false,

  // Show User States
  showIsLoading: false,
  showError: null,
  showIsSuccess: false,

  // Edit User States
  editIsLoading: false,
  editError: null,
  editIsSuccess: false,

  // Delete User States
  deleteIsLoading: false,
  deleteError: null,
  deleteIsSuccess: false,

  // -------------------- Actions --------------------
  loginUser: async (credentials) => {
    set({ loginIsLoading: true, loginError: null, loginIsSuccess: false });
    try {
      const res = await axios.post(LoginAPI, credentials);
      const { access, refresh, user } = res.data;

      // Persist tokens and user data
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        accessToken: access,
        refreshToken: refresh,
        loginIsLoading: false,
        loginIsSuccess: true,
      });

      return user;
    } catch (err) {
      set({
        loginError: err.response?.data?.message || "Login failed",
        loginIsLoading: false,
      });
    }
  },

  registerUser: async (userData) => {
    set({
      registerIsLoading: true,
      registerError: null,
      registerIsSuccess: false,
    });
    try {
      const res = await axios.post(RegisterAPI, userData);
      set({
        registerIsSuccess: true,
        registerIsLoading: false,
      });
      return res.data;
    } catch (err) {
      set({
        registerError: err.response?.data?.message || "Registration failed",
        registerIsLoading: false,
      });
    }
  },

  fetchUsers: async () => {
    set({ showIsLoading: true, showError: null, showIsSuccess: false });
    try {
      const res = await axios.post(ShowUserAPI);
      set({
        userList: res.data,
        showIsSuccess: true,
        showIsLoading: false,
      });
      return res.data;
    } catch (err) {
      set({
        showError: err.response?.data?.message || "Failed to fetch users",
        showIsLoading: false,
      });
    }
  },

  editUser: async (id, updatedData) => {
    set({ editIsLoading: true, editError: null, editIsSuccess: false });
    try {
      await axios.post(`${EditUserAPI}`, { ...updatedData, User_ID : id });
      set({ editIsSuccess: true, editIsLoading: false });
    } catch (err) {
      set({
        editError: err.response?.data?.message || "Failed to edit user",
        editIsLoading: false,
      });
    }
  },

  deleteUser: async (id) => {
    set({ deleteIsLoading: true, deleteError: null, deleteIsSuccess: false });
    try {
      await axios.post(`${DeleteUserAPI}`, { User_ID: id });
      set({ deleteIsSuccess: true, deleteIsLoading: false });
    } catch (err) {
      set({
        deleteError: err.response?.data?.message || "Failed to delete user",
        deleteIsLoading: false,
      });
    }
  },

  logoutUser: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      loginIsSuccess: false,
    });
  },

  clearLoginState: () => set({ loginError: null, loginIsSuccess: false }),
  clearRegisterState: () =>
    set({ registerError: null, registerIsSuccess: false }),
  clearEditState: () => set({ editError: null, editIsSuccess: false }),
  clearDeleteState: () => set({ deleteError: null, deleteIsSuccess: false }),
}));

export default useAuth;
