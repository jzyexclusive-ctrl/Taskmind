export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export function isOverdue(dateString: string | null | undefined): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.getTime() < now.getTime() && date.toDateString() !== now.toDateString();
}