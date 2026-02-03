import type { Base64File, DropdownInterface } from "./AtsCommonInterface";

export interface ReferralInterface {
  referralId?: number;
  jobOpportunityId?: number;
  jobOpportunityDetails?: DropdownInterface;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  currentEmployer?: string;
  currentJobTitle?: string;
  relationshipId?: number;
  relationship?: DropdownInterface;
  noticePeriodId?: number;
  noticePeriod?: DropdownInterface;
  notes?: string;
  createdDate?: string;
  statusId?: number;
  statusDetails?: DropdownInterface;
  resumeFile?: Base64File[];
  documents?: Base64File;
  [key: string]: unknown;
}
