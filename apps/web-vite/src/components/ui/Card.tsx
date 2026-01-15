
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
    noPadding?: boolean;
}

export function Card({ className, hoverable = false, noPadding = false, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl shadow-card border border-gray-100 transition-all duration-300",
                hoverable && "hover:shadow-hover hover:-translate-y-1 cursor-pointer",
                !noPadding && "p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
