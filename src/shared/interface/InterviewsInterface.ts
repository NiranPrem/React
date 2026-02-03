import type { Base64File, DropdownInterface } from "./AtsCommonInterface";
export interface InterviewInterface {
	isScreening?: boolean;
	interviewId?: number;
	interviewName?: string;
	postingTitleId?: number;
	postingTitleDetails?: DropdownInterface;
	departmentId?: number;
	departmentDetails?: DropdownInterface;
	fromDate?: string;
	fromTime?: string;
	toDate?: string;
	toDateTime?: string;
	fromDateTime?: string;
	toTime?: string;
	interviewStatusId?: number;
	interviewStatusDetails?: DropdownInterface;
	interviewerIds?: number[];
	optionalAttendeesIds?: number[];
	interviewOwnerDetails?: DropdownInterface;
	candidateId?: number;
	candidateDetails?: DropdownInterface;
	interviewOwnerId?: number;
	interviewOwner?: DropdownInterface;
	comments?: string;
	openingId?: number;
	jobOpportunityId?: number;
	interviewType?: string;
	interviewers?: DropdownInterface[];
	optionalAttendees?: DropdownInterface[];
	otherFiles?: Base64File[];
	documents?: Base64File[];
	feedbackDetails?: DropdownInterface | null;
	reviewedByDetails?: DropdownInterface | null;
	rating?: number;
	location?: string;
	meetingLink?: string;
	interviewMode?: string;
	[key: string]: unknown;
}

export interface FeedbackInterface {
	isUpdated?: boolean;
	interviewId?: number;
	rating?: number;
	statusId?: number;
	statusdetails?: DropdownInterface;
	comments?: string;
	createdBy?: number;
	updatedBy?: number;
}

export interface InterviewUpdatePayloadInterface {
	data: InterviewInterface;
	message: string;
	success: boolean;
}

export interface InterviewUpdatePayloadInterface {
	data: InterviewInterface;
	message: string;
	success: boolean;
}

export interface InterviewHistoryInterface {
	actionType?: string;
	changesJson?: string;
	jobOpportunity?: string;
	jobOpportunityActivityId?: number;
	jobOpportunityId?: number;
	performedByUserId?: number;
	shortDescription?: string;
	timestamp?: string;
	[key: string]: unknown;
}

export interface InterviewEmailInterface {
	to: string;
	fromEmail: string;
	subject: string;
	body: string;
}

export interface InterviewDecisionInterface {
	interviewId?: number;
	status: string;
	comments: string;
	emailDetails: InterviewEmailInterface;
}
