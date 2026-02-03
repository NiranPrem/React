export interface JobOpeningHistoryInterface {
	actionType?: string;
	changesJson?: string;
	jobOpportunity?: string;
	jobOpportunityActivityId?: number;
	jobOpportunityId?: number;
	performedByUserId?: number;
	performedByUserName?: string;
	shortDescription?: string;
	timestamp?: string;
	[key: string]: unknown;
}
export interface CandidateHistoryInterface {
	actionType?: string;
	candidate?: string;
	candidateActivityId?: number;
	candidateId?: number;
	changesJson?: string;
	performedByUserId?: number;
	performedByUserName?: string;
	shortDescription?: string;
	timestamp?: Date | string | number;
	[key: string]: unknown;
}

export interface FieldChangeDto {
	field?: string;
	oldValue?: string | null;
	newValue?: string | null;
}

export interface JobRequestHistoryInterface {
	actionType?: string;
	changesJson?: string;
	changes?: FieldChangeDto[];
	isStatusChanged?: boolean;
	statusChange?: FieldChangeDto | null;
	jobOpportunity?: string;
	jobOpportunityActivityId?: number;
	performedByUserId?: number;
	performedByUserName?: string;
	shortDescription?: string;
	timestamp?: string;
	[key: string]: unknown;
}

export interface ReferralHistoryInterface {
	actionType?: string;
	changesJson?: string;
	jobOpportunity?: string;
	jobOpportunityActivityId?: number;
	performedByUserId?: number;
	performedByUserName?: string;
	shortDescription?: string;
	timestamp?: string;
	[key: string]: unknown;
}
