export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  tenantId: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  tenantId?: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface AuthSession {
  user: User;
  loginTime: string;
  expiresAt: string;
}

export interface UserCredential {
  id: string;
  username: string;
  password: string; 
  email: string;
  role: UserRole;
  tenantId: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export interface UsersDatabase {
  [tenantId: string]: UserCredential[];
}
