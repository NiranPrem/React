import type { DropdownInterface } from "./AtsCommonInterface";

export interface RequestInterface {
	id?: number;
	jobTitle?: DropdownInterface;
	jobTitleId?: number;
	jobRequestStatusId?: number;
	positionTitle?: string;
	numberOfResources?: number;
	jobDescription?: string;
	requirement?: string;
	requiredSkills?: Array<string>;
	createdDate?: string;
	jobRequestStatus?: DropdownInterface;
	userId?: number;
	recruiterUserId?: number | null;
	officeLocationId?: number;
	regionId?: number;
	totalJobExperience?: string | number;
	requestOwnerName?: string;
	assignedRecruiterName?: string;
	jobOpportunityId?: number;
	jobOpeningPostingTitle?: string;
	reason?: string | null;
	[key: string]: unknown;
}
