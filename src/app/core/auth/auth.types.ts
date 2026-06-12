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

export interface AuthUser {
  id: string;
  email: string;
}
