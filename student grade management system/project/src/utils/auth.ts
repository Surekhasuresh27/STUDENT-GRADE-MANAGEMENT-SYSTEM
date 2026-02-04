import { User } from '../types';

const USERS_STORAGE_KEY = 'gradeManagementUsers';
const CURRENT_USER_KEY = 'currentUser';

const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'teacher@example.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'John Teacher'
  },
  {
    id: '2',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    name: 'Alice Student'
  },
  {
    id: '3',
    email: 'parent@example.com',
    password: 'parent123',
    role: 'parent',
    name: 'Bob Parent'
  }
];

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  if (!users) {
    saveUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  }
  return JSON.parse(users);
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const signIn = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  setCurrentUser(user);
  return user;
};

export const signUp = (email: string, password: string, role: string, name: string): User => {
  const users = getUsers();
  if (users.some(u => u.email === email)) {
    throw new Error('Email already exists');
  }
  
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password, // In a real app, this should be hashed
    role: role as 'teacher' | 'student' | 'parent',
    name
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const signOut = () => {
  setCurrentUser(null);
};