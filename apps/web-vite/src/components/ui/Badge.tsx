
import React from 'react';
import { cn } from './Card';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'teal' | 'coral' | 'yellow' | 'gray' | 'outline' | 'secondary' | 'mint';
}

export function Badge({ className, variant = 'teal', children, ...props }: BadgeProps) {
    const variants = {
        teal: "bg-arduino-mint text-arduino-teal",
        coral: "bg-arduino-coral/20 text-red-500",
        yellow: "bg-arduino-yellow/30 text-orange-600",
        gray: "bg-gray-100 text-gray-600",
        outline: "border border-gray-200 text-gray-500 bg-transparent",
        secondary: "bg-gray-100 text-gray-800",
        mint: "bg-emerald-50 text-emerald-600",
    };

    return (
        <span
            className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
