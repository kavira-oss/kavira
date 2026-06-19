// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  username: string;
  createdAt: Date;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserPublic;
  tokens: AuthTokens;
}
