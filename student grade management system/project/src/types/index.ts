export interface Grade {
  subject: string;
  value: number;
}

export interface Student {
  id: string;
  name: string;
  grades: Grade[];
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be stored hashed in a database
  role: 'teacher' | 'student' | 'parent';
  name: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}