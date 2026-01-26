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
                "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
                hoverable && "hover:bg-muted/50 cursor-pointer transition-colors",
                !noPadding && "p-6",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
