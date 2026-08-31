export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaskFilterParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}