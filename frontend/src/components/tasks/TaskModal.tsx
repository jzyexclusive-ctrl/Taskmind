import React, { useState, useEffect } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import type { CreateTaskDto } from '../../api/task.api';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { X, Calendar, Tag } from 'lucide-react';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskDto) => Promise<void>;
    initialData?: Task | null;
    title: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title,
}) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('TODO');
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setTaskTitle(initialData.title);
            setDescription(initialData.description || '');
            setStatus(initialData.status);
            setPriority(initialData.priority);
            setCategory(initialData.category || '');
            setDueDate(
                initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
            );
        } else {
            setTaskTitle('');
            setDescription('');
            setStatus('TODO');
            setPriority('MEDIUM');
            setCategory('');
            setDueDate('');
        }
        setError(null);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskTitle.trim()) {
            setError('Task title is required.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await onSubmit({
                title: taskTitle.trim(),
                description: description.trim() || undefined,
                status,
                priority,
                category: category.trim() || undefined,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save task.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">

                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
                        {error}
                    </div>
                )}

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Task Title *"
                        placeholder="e.g. Finish database migration script"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                        autoFocus
                    />

                    <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-medium text-slate-300">
                            Description (Optional)
                        </label>
                        <textarea
                            className="w-full bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
                            placeholder="Add key context, bullet points, or notes..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                            <label className="block text-xs font-medium text-slate-300">Status</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>

                        <div className="space-y-1.5 text-left">
                            <label className="block text-xs font-medium text-slate-300">Priority</label>
                            <select
                                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Category"
                            placeholder="e.g. Work, Study"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            leftIcon={<Tag className="w-4 h-4" />}
                        />
                        <Input
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            leftIcon={<Calendar className="w-4 h-4" />}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isLoading}>
                            {initialData ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
