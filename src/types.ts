export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export type UserRole = 'job_seeker' | 'employer';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: string;
}

export interface JobPost {
  id: string;
  employerId: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  specUrl?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobSeekerId: string;
  employerId: string;
  resumeUrl: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: string;
  jobTitle?: string; // Denormalized for easier display
  companyName?: string; // Denormalized for easier display
}
