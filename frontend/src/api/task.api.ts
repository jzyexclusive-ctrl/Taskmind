import { apiClient } from './client';
import type { ApiResponse, Task, PaginatedTasks, TaskFilterParams, TaskStatus, TaskPriority } from '../types';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string | null;
  dueDate?: string | null;
}

export const taskApi = {
  getTasks: async (params?: TaskFilterParams): Promise<ApiResponse<PaginatedTasks>> => {
    const response = await apiClient.get<ApiResponse<PaginatedTasks>>('/tasks', { params });
    return response.data;
  },

  getTaskById: async (id: number): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskDto): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.post<ApiResponse<{ task: Task }>>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskDto): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, status: TaskStatus): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/tasks/${id}`);
    return response.data;
  },
};