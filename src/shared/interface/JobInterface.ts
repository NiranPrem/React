import type { Base64File, DropdownInterface } from "./AtsCommonInterface";

interface Address {
	id?: number;
	city?: string;
	province?: string;
	countryId?: number;
	country?: DropdownInterface;
	postalCode?: number;
}

export interface JobInterface {
	jobOpportunityId?: number;
	jobTitle?: DropdownInterface;
	postingTitle?: string;
	jobTitleId?: number;
	department?: DropdownInterface;
	departmentId?: number;
	region?: DropdownInterface;
	regionId?: number;
	hiringManager?: DropdownInterface;
	hiringManagerId?: number;
	createdBy?: number;
	assignedRecruiter?: DropdownInterface;
	assignedRecruiterId?: number;
	workExperiences?: string;
	jobTypeId?: number;
	jobType?: DropdownInterface;
	statusId?: number;
	status?: DropdownInterface;
	numberOfPeople?: number;
	isReplacement?: boolean;
	dateOpened?: string;
	targetDate?: string;
	officeLocationId?: number;
	officeLocation?: DropdownInterface;
	currencyId?: number;
	currencyDetails?: DropdownInterface;
	salaryId?: number;
	salaryDetails?: DropdownInterface;
	remoteJob?: boolean;
	addressInfo?: Address;
	jobDescription?: string;
	requirements?: string;
	requiredSkills?: Array<string>;
	benefits?: string;
	jobSummaryFile?: Base64File[];
	otherFiles?: Base64File[];
	createdDate?: string;
	expectedConclusionDate?: string;
	stageCount?: number;
	numberOfApplications?: number;
	documents?: Base64File[];
	publishPlatforms?: Array<number>;
	isPublished?: boolean;
	jobRequestId?: number;
	[key: string]: unknown;
}
