/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  UserManagementInterface,
  UserUpdatePayloadInterface,
} from "../../shared/interface/UserManagementInterface";

// Define the structure of the userManagement state
interface UserManagement {
  data: UserManagementInterface[];
  totalCount?: number;
}
// Define the structure of the userManagement state
interface UserManagementState {
  loading: boolean;
  success: boolean;
  editSuccess?: boolean;
  editStateSuccess?: boolean;
  error: string | null;
  totalCount?: number;
  userManagement: UserManagementInterface[] | null;
  selectedUserManagement: UserManagementInterface | null;
}

// Initial state for the userManagement slice
const initialState: UserManagementState = {
  loading: false,
  error: null,
  success: false,
  editSuccess: false,
  editStateSuccess: false,
  totalCount: 0,
  userManagement: null,
  selectedUserManagement: null,
};

// Create a slice for userManagements with actions and reducers
const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    // Fetch all userManagements
    fetchUserManagementRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedUserManagement = null;
      state.success = false;
      state.editSuccess = false;
      state.editStateSuccess = false;
    },
    // Fetch userManagements success
    fetchUserManagementSuccess: (
      state,
      action: PayloadAction<UserManagement>
    ) => {
      const { data, totalCount = 0 } = action.payload;
      state.userManagement = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch userManagements failure
    fetchUserManagementFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.userManagement = [];
      state.selectedUserManagement = null;
      state.error = action.payload;
    },
    // Search userManagements
    searchUserManagementRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        searchTerm?: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedUserManagement = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Search userManagements success
    searchUserManagementSuccess: (
      state,
      action: PayloadAction<UserManagement>
    ) => {
      const { data, totalCount = 0 } = action.payload;
      state.userManagement = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Search userManagements failure
    searchUserManagementFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.userManagement = [];
      state.selectedUserManagement = null;
      state.error = action.payload;
    },
    // Fetch userManagement by ID
    fetchUserManagementByIdRequest: (
      state,
      action: PayloadAction<{ employeeId: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedUserManagement = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch userManagement by ID success
    fetchUserManagementByIdSuccess: (
      state,
      action: PayloadAction<UserManagementInterface>
    ) => {
      state.selectedUserManagement = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Fetch userManagement by ID failure
    fetchUserManagementByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add userManagement
    addUserManagementRequest: (
      state,
      action: PayloadAction<UserManagementInterface>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedUserManagement = null;
      state.editSuccess = false;
    },
    // Add userManagement
    addUserManagementSuccess: (
      state,
      action: PayloadAction<UserManagementInterface>
    ) => {
      if (state.userManagement) {
        state.userManagement = [...state.userManagement, action.payload];
      } else {
        state.userManagement = [action.payload];
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    // Add userManagement failure
    addUserManagementFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    // Update userManagement
    updateUserManagementRequest: (
      state,
      action: PayloadAction<{
        payload: UserManagementInterface;
        employeeId: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Update userManagement success
    updateUserManagementSuccess: (
      state,
      action: PayloadAction<UserUpdatePayloadInterface>
    ) => {
      const updatedUserManagement = action.payload.data;
      if (state.userManagement) {
        state.userManagement = state.userManagement.map((item) =>
          item.employeeId === updatedUserManagement.employeeId
            ? updatedUserManagement
            : item
        );
      }
      if (
        state.selectedUserManagement &&
        state.selectedUserManagement.employeeId ===
        updatedUserManagement.employeeId
      ) {
        state.selectedUserManagement = updatedUserManagement;
      }
      if (state.selectedUserManagement) {
        state.selectedUserManagement = {
          ...state.selectedUserManagement,
          ...updatedUserManagement,
        };
      }
      state.totalCount = state.userManagement?.length ?? 0;
      state.loading = false;
      state.error = null;
      state.editSuccess = true;
    },
    // Update userManagement failure
    updateUserManagementFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.editSuccess = false;
      state.error = action.payload;
    },
    // Reset userManagement state
    resetUserManagementEditState: (state) => {
      state.editSuccess = false;
    },
    // Fetch userManagement by ID
    addUserRevokeRequest: (
      state,
      action: PayloadAction<{ employeeId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedUserManagement = null;
      state.success = false;
      state.editSuccess = false;
      state.editStateSuccess = false;
    },
    // Fetch userManagement by ID success
    addUserRevokeSuccess: (
      state,
      action: PayloadAction<UserManagementInterface>
    ) => {
      state.editStateSuccess = true;
      state.loading = false;
      state.error = null;
    },
    // Fetch userManagement by ID failure
    addUserRevokeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.editStateSuccess = false;
      state.error = action.payload;
    },
    // Fetch userManagement by ID
    addUserResendRequest: (
      state,
      action: PayloadAction<{ employeeId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedUserManagement = null;
      state.success = false;
      state.editStateSuccess = false;
      state.editSuccess = false;
    },
    // Fetch userManagement by ID success
    addUserResendSuccess: (
      state,
      action: PayloadAction<UserManagementInterface>
    ) => {
      state.editStateSuccess = true;
      state.loading = false;
      state.error = null;
    },
    // Fetch userManagement by ID failure
    addUserResendFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.editStateSuccess = false;
      state.error = action.payload;
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchUserManagementRequest,
  fetchUserManagementSuccess,
  fetchUserManagementFailure,
  fetchUserManagementByIdRequest,
  fetchUserManagementByIdSuccess,
  fetchUserManagementByIdFailure,
  addUserManagementRequest,
  addUserManagementSuccess,
  addUserManagementFailure,
  updateUserManagementRequest,
  updateUserManagementSuccess,
  updateUserManagementFailure,
  searchUserManagementRequest,
  searchUserManagementSuccess,
  searchUserManagementFailure,
  resetUserManagementEditState,
  addUserRevokeRequest,
  addUserRevokeSuccess,
  addUserRevokeFailure,
  addUserResendRequest,
  addUserResendSuccess,
  addUserResendFailure,
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
