import React from 'react';
import type { Task } from '../../types';
import { PriorityBadge, StatusBadge } from './TaskBadges';
import { formatDate, isOverdue } from '../../utils/date';
import { Calendar, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'DONE';
  const overdue = isOverdue(task.dueDate) && !isCompleted;

  return (
    <div
      className={cn(
        'group relative bg-slate-900 border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200',
        'hover:border-slate-600 hover:shadow-lg hover:shadow-black/30',
        isCompleted ? 'border-slate-800 opacity-70' : 'border-slate-800',
        overdue && 'border-rose-500/30'
      )}
    >
      {/* Header Row */}
      <div className="flex items-start gap-3">
        {/* Toggle Status Button */}
        <button
          onClick={() => onToggleStatus(task)}
          className={cn(
            'mt-0.5 flex-shrink-0 transition-colors',
            isCompleted ? 'text-emerald-400 hover:text-slate-400' : 'text-slate-600 hover:text-emerald-400'
          )}
          title={isCompleted ? 'Mark as To Do' : 'Mark as Completed'}
        >
          {isCompleted
            ? <CheckCircle2 className="w-5 h-5" />
            : <Circle className="w-5 h-5" />}
        </button>

        {/* Title */}
        <h3 className={cn(
          'flex-1 font-semibold text-sm leading-snug',
          isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
        )}>
          {task.title}
        </h3>

        {/* Action Buttons (show on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition"
            title="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 pl-8">
          {task.description}
        </p>
      )}

      {/* Footer Row: Badges + Due Date */}
      <div className="pl-8 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {task.dueDate && (
          <span className={cn(
            'inline-flex items-center gap-1 text-xs',
            overdue ? 'text-rose-400' : 'text-slate-500'
          )}>
            <Calendar className="w-3 h-3" />
            {overdue && <span className="font-semibold">Overdue · </span>}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};