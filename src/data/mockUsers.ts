import { User } from '@/types/email';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@cityhall.gov',
    department: 'administration',
  },
  {
    id: '2',
    name: 'Finance Manager',
    email: 'finance@cityhall.gov',
    department: 'finance',
  },
  {
    id: '3',
    name: 'Social Service Director',
    email: 'social@cityhall.gov',
    department: 'social',
  },
  {
    id: '4',
    name: 'Audit Officer',
    email: 'audit@cityhall.gov',
    department: 'audit',
  },
  {
    id: '5',
    name: 'Culture Manager',
    email: 'culture@cityhall.gov',
    department: 'culture',
  },
  {
    id: '6',
    name: 'Infrastructure Manager',
    email: 'infrastructure@cityhall.gov',
    department: 'infrastructure',
  },
];

// For demo purposes: password is "password123" for all users
export const validateCredentials = (email: string, password: string): User | null => {
  if (password !== 'password123') {
    return null;
  }
  
  return mockUsers.find(user => user.email === email) || null;
};
