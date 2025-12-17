export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role?: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    phone?: string;
    avatar?: string;
  };
  token: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}