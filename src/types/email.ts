export type EmailStatus = 'pending' | 'responded' | 'forwarded' | 'closed' | 'archived';
export type Department = 'administration' | 'finance' | 'public-works' | 'planning' | 'human-resources';
export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

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
  attachments?: Attachment[];
  priority: Priority;
  dueDate?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
}

export type ActionType = 'accept' | 'reject' | 'request-info' | 'forward' | 'custom' | 'acknowledge';
