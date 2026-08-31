import React from 'react';
import type { TaskPriority, TaskStatus } from '../../types';
import { cn } from '../../utils/cn';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
    const styles = {
        LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    return (
        <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border', styles[priority])}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {priority}
        </span>
    );
};

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
    const config = {
        TODO: {
            label: 'To Do',
            style: 'bg-slate-800 text-slate-300 border-slate-700',
            icon: <Clock className="w-3 h-3" />,
        },
        IN_PROGRESS: {
            label: 'In Progress',
            style: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            icon: <AlertCircle className="w-3 h-3" />,
        },
        DONE: {
            label: 'Done',
            style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            icon: <CheckCircle2 className="w-3 h-3" />,
        },
    };

    const item = config[status];

    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border', item.style)}>
            {item.icon}
            {item.label}
        </span>
    );
};