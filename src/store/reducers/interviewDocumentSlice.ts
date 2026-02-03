/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DocumentInterface } from "../../shared/interface/DocumentInterface";
import type { InterviewInterface } from "../../shared/interface/InterviewsInterface";

// Define the structure of a document
interface Documents {
  data: DocumentInterface[];
  totalCount?: number;
}

// Define the structure of the documents state
interface DocumentsState {
  loading: boolean;
  error: string | null;
  totalCount?: number;
  documents: DocumentInterface[] | null;
  deleteSuccess: boolean;
  updateSuccess: boolean;
}

// Initial state for the interview document slice
const initialState: DocumentsState = {
  loading: false,
  error: null,
  totalCount: 0,
  documents: null,
  deleteSuccess: false,
  updateSuccess: false,
};

// Create a slice for interview documents with actions and reducers
const interviewDocumentSlice = createSlice({
  name: "interviewDocuments",
  initialState,
  reducers: {
    // Fetch documents requests
    fetchInterviewDocumentsRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        interviewId: string;
      }>
    ) => {
      state.deleteSuccess = false;
      state.updateSuccess = false;
      state.loading = true;
      state.error = null;
    },
    // Fetch documents success
    fetchInterviewDocumentsSuccess: (
      state,
      action: PayloadAction<Documents>
    ) => {
      const { data, totalCount = 0 } = action.payload;
      state.documents = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch documents failure
    fetchInterviewDocumentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.documents = [];
      state.totalCount = 0;
    },
    // Delete document request
    deleteInterviewDocumentRequest: (
      state,
      action: PayloadAction<{ documentFileId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
      state.updateSuccess = false;
    },
    // Delete document success
    deleteInterviewDocumentSuccess: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.documents) {
        state.documents = state.documents.filter(
          (item) => item.documentFileId !== id
        );
      }
      state.totalCount = (state.totalCount ?? 0) - 1;
      state.loading = false;
      state.error = null;
      state.deleteSuccess = true;
    },
    // Delete document failure
    deleteInterviewDocumentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.deleteSuccess = false;
    },
    // Update document
    updateInterviewDocumentRequest: (
      state,
      action: PayloadAction<InterviewInterface>
    ) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
      state.updateSuccess = false;
    },
    // Update document success
    updateInterviewDocumentSuccess: (
      state,
      action: PayloadAction<InterviewInterface>
    ) => {
      state.loading = false;
      state.error = null;
      state.updateSuccess = true;
    },
    // Update document failure
    updateInterviewDocumentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },
  },
});

export const {
  fetchInterviewDocumentsRequest,
  fetchInterviewDocumentsSuccess,
  fetchInterviewDocumentsFailure,
  deleteInterviewDocumentRequest,
  deleteInterviewDocumentSuccess,
  deleteInterviewDocumentFailure,
  updateInterviewDocumentRequest,
  updateInterviewDocumentSuccess,
  updateInterviewDocumentFailure,
} = interviewDocumentSlice.actions;

export default interviewDocumentSlice.reducer;
