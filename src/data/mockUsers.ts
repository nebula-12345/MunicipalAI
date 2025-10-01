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
    name: 'Public Works Director',
    email: 'publicworks@cityhall.gov',
    department: 'public-works',
  },
  {
    id: '4',
    name: 'Planning Officer',
    email: 'planning@cityhall.gov',
    department: 'planning',
  },
  {
    id: '5',
    name: 'HR Manager',
    email: 'hr@cityhall.gov',
    department: 'human-resources',
  },
];

// For demo purposes: password is "password123" for all users
export const validateCredentials = (email: string, password: string): User | null => {
  if (password !== 'password123') {
    return null;
  }
  
  return mockUsers.find(user => user.email === email) || null;
};
