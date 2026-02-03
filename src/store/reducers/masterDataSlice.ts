/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserManagementInterface } from "../../shared/interface/UserManagementInterface";

// Define the structure of a job opening
interface MasterData {
  sequenceNumber?: number;
  label?: string;
  value?: number;
  isCandidate?: boolean;
  code?: number;
  name?: string;
  id?: number;
  [key: string]: unknown;
}

// Define the structure of the master data state
interface MasterDataState {
  loading: boolean;
  error: string | null;
  attendees: MasterData[];
  region: MasterData[];
  [key: string]:
  | MasterData[]
  | boolean
  | string
  | null
  | undefined
  | number[]
  | number
  | string[]
  | Array<MasterData>;
}

const initialState: MasterDataState = {
  loading: false,
  error: null,
  candidateStatus: [],
  country: [],
  currency: [],
  departments: [],
  industry: [],
  jobTitle: [],
  jobType: [],
  locations: [],
  region: [],
  qualification: [],
  roles: [],
  salary: [],
  source: [],
  status: [],
  stages: [],
  users: [],
  interviewers: [],
  jobOpenings: [],
  relationship: [],
  noticePeriod: [],
  attendees: [],
  candidates: [],
  departmentId: null,
  candidatesInterviewStatus: null,
  jobRequestStatus: [],
  interviewCandidates: [],
};

// Create a slice for master data with actions and reducers
const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    fetchMasterDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action to handle successful fetching of master data
    fetchMasterDataSuccess: (state, action: PayloadAction<MasterDataState>) => {
      const {
        candidateStatus,
        country,
        currency,
        departments,
        industry,
        jobTitle,
        jobType,
        locations,
        region,
        roles,
        salary,
        source,
        stages,
        status,
        qualification,
        relationship,
        noticePeriod,
        candidatesInterviewStatus,
        jobRequestStatus,
      } = action.payload;
      // Update the state with the fetched master data
      state.candidateStatus = candidateStatus ?? [];
      state.country = country ?? [];
      state.currency = currency ?? [];
      state.departments = departments ?? [];
      state.industry = industry ?? [];
      state.jobTitle = jobTitle ?? [];
      state.jobType = jobType ?? [];
      state.locations = locations ?? [];
      state.region = region ?? [];
      state.roles = roles ?? [];
      state.salary = salary ?? [];
      state.source = source ?? [];
      state.stages = stages ?? [];
      state.status = status ?? [];
      state.qualification = qualification ?? [];
      state.relationship = relationship ?? [];
      state.noticePeriod = noticePeriod ?? [];
      state.candidatesInterviewStatus = candidatesInterviewStatus ?? null;
      state.jobRequestStatus = jobRequestStatus ?? [];
      state.loading = false;
      state.error = null;
    },
    // Action to handle failure in fetching master data
    fetchMasterDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      // Retain existing data to prevent data loss on fetch failure
    },
    // Fetch candidates by opportunity id
    fetchInterviewCandidatesByJobOpportunityRequest: (
      state,
      action: PayloadAction<{
        jobOpportunityId: number;
      }>,
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    // Fetch interview  success
    fetchInterviewCandidatesByJobOpportunitySuccess: (
      state,
      action: PayloadAction<MasterData[]>,
    ) => {
      state.interviewCandidates = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Fetch interview  failure
    fetchInterviewCandidatesByJobOpportunityFailure: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMasterJobOpeningRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action to handle successful fetching of master data
    fetchMasterJobOpeningSuccess: (
      state,
      action: PayloadAction<MasterDataState>
    ) => {
      const { jobOpening } = action.payload;
      // Update the state with the fetched master data
      state.jobOpenings = jobOpening ?? [];
      state.loading = false;
      state.error = null;
    },
    // Action to handle failure in fetching master data
    fetchMasterJobOpeningFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      // Retain existing data to prevent data loss on fetch failure
    },
    // Action to fetch user data
    fetchUserDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action to handle successful fetching of user data
    fetchUserDataSuccess: (state, action: PayloadAction<[MasterData]>) => {
      const users = action.payload;
      state.users = users ?? [];
      state.loading = false;
      state.error = null;
    },
    // Action to handle failure in fetching user data
    fetchUserDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      // Retain existing data to prevent data loss on fetch failure
    },
    // Action to fetch Attendees data
    fetchAttendeesDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action to handle successful fetching of Attendees data
    fetchAttendeesDataSuccess: (state, action: PayloadAction<[MasterData]>) => {
      const attendees = action.payload;
      state.attendees = attendees ?? [];
      state.loading = false;
      state.error = null;
    },
    // Action to handle failure in fetching Attendees data
    fetchAttendeesDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      // Retain existing data to prevent data loss on fetch failure
    },

    fetchAllCandidatesRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.departmentId = [];
    },
    // Action to handle successful fetching of master data
    fetchAllCandidatesSuccess: (
      state,
      action: PayloadAction<MasterDataState>
    ) => {
      const { candidates } = action.payload;
      // Update the state with the fetched master data
      state.candidates = candidates ?? [];
      state.loading = false;
      state.error = null;
    },
    // Action to handle failure in fetching master data
    fetchAllCandidatesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      // Retain existing data to prevent data loss on fetch failure
    },

    // Action to fetch Attendees data
    fetchJobDepartmentRequest: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    // Action to handle successful fetching of Attendees data
    fetchJobDepartmentSuccess: (
      state,
      action: PayloadAction<MasterDataState>
    ) => {
      const { departmentId } = action.payload;
      state.departmentId = departmentId ?? [];
      state.loading = false;
      state.error = null;
    },
    // Action to handle failure in fetching Attendees data
    fetchJobDepartmentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      // Retain existing data to prevent data loss on fetch failure
    },
    fetchUsersByRoleRequest: (state) => {
      state.loading = true;
    },
    // Actions for fetching interviewers
    // Actions for successful fetching interviewers
    fetchUsersByRoleSuccess: (
      state,
      action: PayloadAction<UserManagementInterface[]>
    ) => {
      state.interviewers = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Actions for failure in fetching interviewers
    fetchUsersByRoleFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

// Export actions for use in components and sagas
export const {
  fetchMasterDataRequest,
  fetchMasterDataSuccess,
  fetchMasterDataFailure,
  fetchUserDataRequest,
  fetchUserDataSuccess,
  fetchUserDataFailure,
  fetchAttendeesDataRequest,
  fetchAttendeesDataSuccess,
  fetchAttendeesDataFailure,
  fetchMasterJobOpeningRequest,
  fetchMasterJobOpeningSuccess,
  fetchMasterJobOpeningFailure,
  fetchAllCandidatesRequest,
  fetchAllCandidatesSuccess,
  fetchAllCandidatesFailure,
  fetchJobDepartmentRequest,
  fetchJobDepartmentSuccess,
  fetchJobDepartmentFailure,
  fetchUsersByRoleRequest,
  fetchUsersByRoleSuccess,
  fetchUsersByRoleFailure,
  fetchInterviewCandidatesByJobOpportunityRequest,
  fetchInterviewCandidatesByJobOpportunitySuccess,
  fetchInterviewCandidatesByJobOpportunityFailure,
} = masterDataSlice.actions;

export default masterDataSlice.reducer;
