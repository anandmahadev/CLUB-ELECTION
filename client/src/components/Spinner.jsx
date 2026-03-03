/**
 * Spinner Component
 * Simple loading spinner using Tailwind
 */
export default function Spinner({ size = 'md', color = 'primary' }) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-[3px]',
    };

    const colors = {
        primary: 'border-primary-600 border-t-transparent',
        white: 'border-white border-t-transparent',
        slate: 'border-slate-400 border-t-transparent',
    };

    return (
        <span
            className={`inline-block rounded-full animate-spin ${sizes[size]} ${colors[color]}`}
            role="status"
            aria-label="Loading"
        />
    );
}
