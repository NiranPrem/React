import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the structure of a hiring manager
interface HiringManager {
  userId: number;
  name: string;
  label?: string;
  value?: string;
}

// Define the structure of the hiring manager state
interface HiringManagerState {
  loading: boolean;
  error: string | null;
  hiringManagers: HiringManager[];
}

// Initial state for the hiring manager slice
const initialHiringManagerState: HiringManagerState = {
  loading: false,
  error: null,
  hiringManagers: [],
};

// Create a slice for hiring managers
const hiringManagerSlice = createSlice({
  name: "hiringManagers",
  initialState: initialHiringManagerState,
  reducers: {
    // Actions for fetching hiring managers
    fetchHiringManagersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Actions for successful fetching of hiring managers
    fetchHiringManagersSuccess: (
      state,
      action: PayloadAction<HiringManager[]>
    ) => {
      state.hiringManagers = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Actions for failure in fetching hiring managers
    fetchHiringManagersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchHiringManagersRequest,
  fetchHiringManagersSuccess,
  fetchHiringManagersFailure,
} = hiringManagerSlice.actions;

export default hiringManagerSlice.reducer;
