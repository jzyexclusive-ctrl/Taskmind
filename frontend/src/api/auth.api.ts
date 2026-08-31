import { apiClient } from './client';
import type { ApiResponse, User } from '../types';

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterDto): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },
};