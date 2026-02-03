// This file contains the environment configuration for the development environment.
export const API_URLS = {
	AD_AUTH_LOGIN: "ad-auth/login",
	AUTH_LOGIN: "Token/generate",
	AUTH_REFRESH: "auth/refresh",

	USERS: "Users",

	JOB_OPENING: "JobOpening",
	JOB_OFFER: "JobOfferLetter",
	CANDIDATES: "Candidates",
	JOB_REQUEST: "JobRequest",
	REFERRAL: "Referral",
	INTERVIEWS: "Interview",

	MASTER_DATA: "MasterData/getAllMasterData",
	USERS_BY_ROLE: "Users/by-role?role=RECRUITER",
	USERS_BY_ROLE_INTERVIEWER: "users/by-role?role=INTERVIEWS",
	USERS_BY_ROLE_HIRING_MANAGER: "Users/by-role?role=BUSINESSUNITHEAD",
	CANDIDATES_BY_JOB_OPPORTUNITY_ID:
		"Candidates/candidates-by-job-opportunity-id",

	DOCUMENTS: "documents",

	CALENDAR: "Calendar",
	NOTIFICATIONS: "notifications",
};
