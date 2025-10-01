export type EmailStatus = 'pending' | 'responded' | 'forwarded' | 'closed';
export type Department = 'administration' | 'finance' | 'public-works' | 'planning' | 'human-resources';

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: Date;
  department: Department;
  status: EmailStatus;
  isRead: boolean;
  hasAttachments: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
}

export type ActionType = 'accept' | 'reject' | 'request-info' | 'forward' | 'custom' | 'acknowledge';
