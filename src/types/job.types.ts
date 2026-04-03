export type JobStatus = 'Applied' | 'Interview' | 'Rejected' | 'Offer';
export type FilterStatus = 'All' | JobStatus;

export interface Job {
  id: string;
  companyName: string;
  role: string;
  status: JobStatus;
  appliedDate: string;
  jobLink?: string;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface JobFormData {
  companyName: string;
  role: string;
  status: JobStatus;
  appliedDate: string;
  jobLink: string;
  notes: string;
  followUpDate: string;
}
