import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/task.api';
import type { CreateTaskDto } from '../api/task.api';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { Button } from '../components/common/Button';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  LogOut,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch Tasks with current filters
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await taskApi.getTasks({
        search: search.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
        sortBy: sortBy,
        order: 'desc',
        limit: 50,
      });
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  // Handler: Create or Update Task
  const handleSaveTask = async (data: CreateTaskDto) => {
    if (editingTask) {
      await taskApi.updateTask(editingTask.id, data);
    } else {
      await taskApi.createTask(data);
    }
    fetchTasks();
  };

  // Handler: Quick Toggle Status
  const handleToggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'DONE' ? 'TODO' : 'DONE';
    await taskApi.updateStatus(task.id, nextStatus);
    fetchTasks();
  };

  // Handler: Delete Task
  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await taskApi.deleteTask(taskId);
      fetchTasks();
    }
  };

  // Quick stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter((t) => t.status === 'TODO').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">TaskMind</h1>
              <p className="text-xs text-slate-400">Personal Productivity Space</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 space-y-8 flex-1">

        {/* Top Header & New Task Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              My Tasks
            </h2>
            <p className="text-sm text-slate-400">
              Organize, prioritize, and track your daily work.
            </p>
          </div>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
          >
            Create New Task
          </Button>
        </div>

        {/* Productivity Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Tasks</p>
              <p className="text-xl font-bold text-white">{totalTasks}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">To Do</p>
              <p className="text-xl font-bold text-white">{pendingTasks}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">In Progress</p>
              <p className="text-xl font-bold text-white">{inProgressTasks}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Completed</p>
              <p className="text-xl font-bold text-white">{completedTasks}</p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Status Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-md transition ${statusFilter === s
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {s === 'ALL' ? 'All' : s === 'IN_PROGRESS' ? 'In Progress' : s === 'TODO' ? 'To Do' : 'Done'}
                </button>
              ))}
            </div>

            {/* Priority Filter Dropdown */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-slate-400 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="createdAt" className="bg-slate-900">Newest First</option>
                <option value="dueDate" className="bg-slate-900">Due Date</option>
                <option value="priority" className="bg-slate-900">Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Grid / Empty State */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm">Fetching your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl py-16 px-4 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-semibold text-white">No tasks found</h3>
              <p className="text-xs text-slate-400">
                {search || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                  ? 'No tasks match your current filters. Try resetting them.'
                  : 'You have zero active tasks. Click below to create your first one!'}
              </p>
            </div>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
            >
              Add First Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      />
    </div>
  );
};