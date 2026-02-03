/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DocumentInterface } from "../../shared/interface/DocumentInterface";
import type { CandidateInterface } from "../../shared/interface/CandidateInterface";

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

// Initial state for the candidate document slice
const initialState: DocumentsState = {
  loading: false,
  error: null,
  totalCount: 0,
  documents: null,
  deleteSuccess: false,
  updateSuccess: false,
};

const candidateDocumentSlice = createSlice({
  name: "candidateDocuments",
  initialState,
  reducers: {
    // Fetch documents request
    fetchCandidateDocumentsRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        candidateId: string;
      }>
    ) => {
      state.deleteSuccess = false;
      state.updateSuccess = false;
      state.loading = true;
      state.error = null;
    },
    // Fetch documents success
    fetchCandidateDocumentsSuccess: (state, action: PayloadAction<Documents>) => {
      const { data, totalCount = 0 } = action.payload;
      state.documents = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch documents failure
    fetchCandidateDocumentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.documents = [];
      state.totalCount = 0;
    },
    // Delete document request
    deleteCandidateDocumentRequest: (
      state,
      action: PayloadAction<{ documentFileId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
      state.updateSuccess = false;
    },
    // Delete document success
    deleteCandidateDocumentSuccess: (state, action: PayloadAction<number>) => {
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
    deleteCandidateDocumentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.deleteSuccess = false;
    },
    // Update document
    updateCandidateDocumentRequest: (state, action: PayloadAction<CandidateInterface>) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
      state.updateSuccess = false;
    },
    // Update document success
    updateCandidateDocumentSuccess: (state, action: PayloadAction<CandidateInterface>) => {
      state.loading = false;
      state.error = null;
      state.updateSuccess = true;
    },
    // Update document failure
    updateCandidateDocumentFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },
  },
});

export const {
  fetchCandidateDocumentsRequest,
  fetchCandidateDocumentsSuccess,
  fetchCandidateDocumentsFailure,
  deleteCandidateDocumentRequest,
  deleteCandidateDocumentSuccess,
  deleteCandidateDocumentFailure,
  updateCandidateDocumentRequest,
  updateCandidateDocumentSuccess,
  updateCandidateDocumentFailure,
} = candidateDocumentSlice.actions;

export default candidateDocumentSlice.reducer;
