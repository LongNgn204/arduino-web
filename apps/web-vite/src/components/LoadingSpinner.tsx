// LoadingSpinner.tsx - Loading và Skeleton components

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

// Loading Spinner đơn giản
export function LoadingSpinner({ size = 'md', text }: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeClasses[size]} border-3 border-slate-600 border-t-cyan-400 rounded-full animate-spin`} />
            {text && <p className="text-slate-400 text-sm">{text}</p>}
        </div>
    );
}

// Full page loading
export function PageLoading() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Đang tải..." />
        </div>
    );
}

// Skeleton cho Card
export function CardSkeleton() {
    return (
        <div className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-4" />
            <div className="h-3 bg-slate-700 rounded w-1/2 mb-2" />
            <div className="h-3 bg-slate-700 rounded w-2/3" />
        </div>
    );
}

// Skeleton cho List item
export function ListItemSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-slate-700 rounded-lg" />
            <div className="flex-1">
                <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
            </div>
        </div>
    );
}

// Skeleton Grid
export function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

// Skeleton cho Lesson Page
export function LessonSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 animate-pulse">
            {/* Header */}
            <div className="h-8 bg-slate-700 rounded w-1/2 mb-4" />
            <div className="h-4 bg-slate-700 rounded w-1/4 mb-8" />

            {/* Content */}
            <div className="space-y-4">
                <div className="h-4 bg-slate-700 rounded w-full" />
                <div className="h-4 bg-slate-700 rounded w-5/6" />
                <div className="h-4 bg-slate-700 rounded w-4/6" />
                <div className="h-32 bg-slate-700 rounded w-full mt-6" />
                <div className="h-4 bg-slate-700 rounded w-full" />
                <div className="h-4 bg-slate-700 rounded w-3/4" />
            </div>
        </div>
    );
}

export default LoadingSpinner;
