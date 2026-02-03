/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  EventByInterviewerInterface,
  EventInterface,
} from "../../shared/interface/EventInterface";

// Define the structure of the Event Request state
interface Event {
  data: EventInterface[];
  totalCount?: number;
}

interface Interviewer {
  data: EventByInterviewerInterface[];
}
// Define the structure of the Event Request state
interface EventState {
  loading: boolean;
  success: boolean;
  editSuccess?: boolean;
  error: string | null;
  totalCount?: number;
  events: EventInterface[] | null;
  selectedEvents: EventInterface[] | null;
  interviewer: EventByInterviewerInterface[] | null;
}

// Initial state for the Event Request slice
const initialState: EventState = {
  loading: false,
  error: null,
  success: false,
  editSuccess: false,
  totalCount: 0,
  events: null,
  selectedEvents: null,
  interviewer: null,
};

// Create a slice for Event Requests with actions and reducers
const EventSlice = createSlice({
  name: "calendarEvents",
  initialState,
  reducers: {
    // Fetch all Event Requests
    fetchEventRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch Event Requests success
    fetchEventSuccess: (state, action: PayloadAction<Event>) => {
      const { data, totalCount = 0 } = action.payload;
      state.events = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch Event Requests failure
    fetchEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.events = [];
      state.error = action.payload;
    },
    // Fetch Event Requests by Interviewer ID
    fetchEventByIntrerviewerRequest: (
      state,
      action: PayloadAction<{ InterviewerId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch Event Requests success
    fetchEventByIntrerviewerSuccess: (state, action: PayloadAction<Event>) => {
      const { data, totalCount = 0 } = action.payload;
      state.events = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch Event Requests failure
    fetchEventByIntrerviewerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.events = [];
      state.error = action.payload;
    },
    // Fetch Events Request by ID
    fetchEventByIdRequest: (
      state,
      action: PayloadAction<{ EventId: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedEvents = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch Events Request by ID success
    fetchEventByIdSuccess: (state, action: PayloadAction<Event>) => {
      const { data, totalCount = 0 } = action.payload;
      state.selectedEvents = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch Events Request by ID failure
    fetchEventByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add Event Request
    addEventRequest: (state, action: PayloadAction<EventInterface>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Add Event Request
    addEventSuccess: (state, action: PayloadAction<EventInterface>) => {
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    // Add Event Request failure
    addEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    // Update Event Request
    updateEventRequest: (state, action: PayloadAction<EventInterface>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Update Event Request success
    updateEventSuccess: (state, action: PayloadAction<EventInterface>) => {
      state.loading = false;
      state.error = null;
      state.editSuccess = true;
    },
    // Update Event Request failure
    updateEventFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Fetch all Event Requests
    fetchInterviewerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch Event Requests success
    fetchInterviewerSuccess: (state, action: PayloadAction<Interviewer>) => {
      const { data } = action.payload;
      state.interviewer = data;
      state.loading = false;
      state.error = null;
    },
    // Fetch Event Requests failure
    fetchInterviewerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.interviewer = [];
      state.error = action.payload;
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchEventRequest,
  fetchEventSuccess,
  fetchEventFailure,
  fetchEventByIntrerviewerRequest,
  fetchEventByIntrerviewerSuccess,
  fetchEventByIntrerviewerFailure,
  fetchEventByIdRequest,
  fetchEventByIdSuccess,
  fetchEventByIdFailure,
  addEventRequest,
  addEventSuccess,
  addEventFailure,
  updateEventRequest,
  updateEventSuccess,
  updateEventFailure,
  fetchInterviewerRequest,
  fetchInterviewerSuccess,
  fetchInterviewerFailure,
} = EventSlice.actions;

export default EventSlice.reducer;
