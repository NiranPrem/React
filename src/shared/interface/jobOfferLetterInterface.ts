import type { Base64File, DropdownInterface } from "./AtsCommonInterface";

export interface JobOfferInterface {
	id?: number;
	candidateId?: number;
	candidateName?: string;
	jobOpportunityId?: number;
	tentativeJoiningDate?: string;
	offerRolloutDate?: string;
	applicantAcceptedDate?: string;
	status?: DropdownInterface;
	joiningDate?: string;
	emailSubject?: string;
	emailBody?: string;
	signature?: string;
	sentByUserId?: number;
	responseExpiresOn?: string;
	totalCount?: number;
	remainingCount?: number;
	offerLetterDocuments?: Base64File[];
}