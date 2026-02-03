import { all } from "redux-saga/effects";
import { watchAuth } from "./authSaga";
import { watchJobOpening } from "./jobOpeningSaga";
import { watchNotification } from "./notificationSaga";
import { watchMasterData } from "./masterDataSaga";
import { watchJobOpeningDocument } from "./jobOpeningDocumentSaga";
import { watchCandidateDocument } from "./candidateDocumentSaga";
import { watchAssignedRecruiter } from "./assignedRecruiterSaga";
import { watchHiringManager } from "./hiringManagerSaga";
import { watchCandidate } from "./candidateSaga";
import { watchJobRequest } from "./jobRequestSaga";
import { watchCandidateHistory } from "./candidateHistorySaga";
import { watchJobOpeningHistory } from "./jobOpeningHistorySaga";
import { watchJobRequestHistory } from "./jobRequestHistorySaga";
import { watchReferrals } from "./referralSaga";
import { watchReferralHistory } from "./referralHistorySaga";
import { watchReferralResume } from "./referralResumeSaga";
import { watchCandidateResume } from "./candidateResumeSaga";
import { watchEvents } from "./eventSaga";
import { watchReferralJobOpening } from "./referralJobOpeningSaga";
import { watchInterview } from "./interviewSaga";
import { watchUserManagement } from "./userManagementSaga";
import { watchInterviewDocument } from "./interviewDocumentSaga";
import { watchInterviewHistory } from "./interviewHistorySaga";
import { watchJobOfferLetter } from "./JobOfferLetterSaga";

// Root saga that combines all sagas
export default function* rootSaga() {
	yield all([
		watchAuth(),

		watchJobOpening(),
		watchJobOpeningDocument(),
		watchJobOpeningHistory(),
		watchJobOfferLetter(),

		watchCandidate(),
		watchCandidateDocument(),
		watchCandidateResume(),
		watchCandidateHistory(),

		watchJobRequest(),
		watchJobRequestHistory(),

		watchReferrals(),
		watchReferralResume(),
		watchReferralHistory(),

		watchReferralJobOpening(),

		watchUserManagement(),

		watchInterview(),
		watchInterviewDocument(),
		watchInterviewHistory(),

		watchEvents(),

		watchMasterData(),
		watchAssignedRecruiter(),
		watchHiringManager(),

		watchNotification(),
	]);
}
