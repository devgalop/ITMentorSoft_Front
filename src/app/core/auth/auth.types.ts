export type UserRole = 'admin' | 'teacher' | 'student' | 'user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  is_successful: boolean;
  token: string;
  expiration_time: number;
  refresh_token: string;
}

export interface JwtPayload {
  user_name: string;
  role: UserRole;
  exp: number;
}

export interface AuthUser {
  userName: string;
  role: UserRole;
}