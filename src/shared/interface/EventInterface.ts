export interface Attendees {
  id?: number;
  code?: number;
  isCandidate?: boolean;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export interface EventInterface {
  eventId?: number;
  createdBy?: string | number;
  title?: string;
  start?: Date | string;
  end?: Date | string;
  startTime?: string;
  endTime?: string;
  attendees?: Array<Attendees> | Array<string>; // Updated
  notes?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  isAvailable?: boolean;
  [key: string]: unknown;
}

export interface EventByInterviewerInterface {
  id?: number;
  isCandidate?: boolean;
  name?: string;
  [key: string]: unknown;
}
