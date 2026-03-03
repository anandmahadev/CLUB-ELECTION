/**
 * Format a date string into a more readable format.
 * @param {string} dateString - The ISO date string to format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};
