export interface LoginResponseData {
  token: string;
  email: string;
  id: number;
  role: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  retypePassword?: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword?: string;
}
