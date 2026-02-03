import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobOpeningReducer from "./jobOpeningSlice";
import notificationReducer from "./notificationSlice";
import masterDataReducer from "./masterDataSlice";
import jobOpeningDocumentsReducer from "./jobOpeningDocumentSlice";
import assignedRecruitersReducer from "./assignedRecruiterSlice";
import hiringManagerReducer from "./hiringManagerSlice";
import candidateReducer from "./candidateSlice";
import candidateDocumentsReducer from "./candidateDocumentSlice";
import candidateResumeReducer from "./candidateResumeSlice";
import jobRequestReducer from "./jobRequestSlice";
import candidateHistoryReducer from "./candidateHistorySlice";
import jobOpeningHistoryReducer from "./jobOpeningHistorySlice";
import jobRequestHistoryReducer from "./jobRequestHistorySlice";
import referralReducer from "./referralSlice";
import referralHistoryReducer from "./referralHistorySlice";
import referralResumesReducer from "./referralResumeSlice";
import eventReducer from "./eventSlice";
import referralJobOpeningReducer from "./referralJobOpeningSlice";
import interviewReducer from "./interviewSlice";
import userManagementReducer from "./userManagementSlice";
import interviewDocumentSlice from "./interviewDocumentSlice";
import interviewHistoryReducer from "./interviewHistorySlice";
import jobOfferLetterReducer from "./jobOfferLetterSlice";

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  auth: authReducer,

  jobOpening: jobOpeningReducer,
  jobOpeningDocuments: jobOpeningDocumentsReducer,
  jobOpeningHistory: jobOpeningHistoryReducer,
  jobOfferLetter: jobOfferLetterReducer,

  candidates: candidateReducer,
  candidateDocuments: candidateDocumentsReducer,
  candidateResumes: candidateResumeReducer,
  candidateHistory: candidateHistoryReducer,

  jobRequest: jobRequestReducer,
  jobRequestHistory: jobRequestHistoryReducer,

  referrals: referralReducer,
  referralResumes: referralResumesReducer,
  referralsHistory: referralHistoryReducer,

  referralJobOpening: referralJobOpeningReducer,

  interviews: interviewReducer,
  interviewDocuments: interviewDocumentSlice,
  interviewHistory: interviewHistoryReducer,

  userManagement: userManagementReducer,

  calendarEvents: eventReducer,

  assignedRecruiter: assignedRecruitersReducer,
  hiringManager: hiringManagerReducer,
  masterData: masterDataReducer,

  notifications: notificationReducer,

  // Add other reducers here as needed
});

export default rootReducer;
