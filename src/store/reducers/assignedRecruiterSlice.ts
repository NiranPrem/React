import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the structure of an assigned recruiter
interface AssignedRecruiter {
  userId: number;
  name: string;
  label?: string;
  value?: string;
}

// Define the structure of the assigned recruiter state
interface AssignedRecruiterState {
  loading: boolean;
  error: string | null;
  assignedRecruiters: AssignedRecruiter[];
}

// Initial state for the assigned recruiter slice
const initialAssignedRecruiterState: AssignedRecruiterState = {
  loading: false,
  error: null,
  assignedRecruiters: [],
};

// Create a slice for assigned recruiters
// This slice will handle the state related to assigned recruiters

const assignedRecruiterSlice = createSlice({
  name: "assignedRecruiters",
  initialState: initialAssignedRecruiterState,
  reducers: {
    fetchAssignedRecruitersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAssignedRecruitersSuccess: (
      state,
      action: PayloadAction<AssignedRecruiter[]>
    ) => {
      state.assignedRecruiters = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchAssignedRecruitersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export the actions and reducer from the slice
export const {
  fetchAssignedRecruitersRequest,
  fetchAssignedRecruitersSuccess,
  fetchAssignedRecruitersFailure,
} = assignedRecruiterSlice.actions;

export default assignedRecruiterSlice.reducer;
