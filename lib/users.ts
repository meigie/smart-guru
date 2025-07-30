import bcrypt from 'bcryptjs';
import { Department } from '@/types';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  department: Department;
  createdAt: Date;
}

// Generate password hash for "password123"
const passwordHash = bcrypt.hashSync('password123', 10);

// Mock user database - in a real app, this would be a database
export let users: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Tan Ah Kaw',
    password: passwordHash,
    role: 'admin',
    department: 'AAD',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Xiao Mei Mei',
    password: passwordHash,
    role: 'user',
    department: 'HIS',
    createdAt: new Date(),
  },
];

export function addUser(user: Omit<User, 'id' | 'createdAt'>) {
  const newUser: User = {
    ...user,
    id: (users.length + 1).toString(),
    createdAt: new Date(),
  };
  users.push(newUser);
  return newUser;
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email);
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
}
