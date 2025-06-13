// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

// User Types
export interface UserDto {
  id: number;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  roleIds: number[];
}

export interface UpdateUserRequest {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  roleIds?: number[];
}

// Role Types
export interface RoleDto {
  id: number;
  name: string;
  description?: string;
}

// Dashboard Types
export interface DashboardResponse {
  message: string;
  role: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
} 