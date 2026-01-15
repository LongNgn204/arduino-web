
import React from 'react';
import { cn } from './Card'; // Re-use cn utility

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-arduino-teal text-white shadow-lg shadow-arduino-teal/20 hover:shadow-xl hover:shadow-arduino-teal/30 hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-white text-arduino-teal border-2 border-arduino-teal/10 hover:bg-arduino-mint/20 hover:border-arduino-teal/30",
        ghost: "text-arduino-text-secondary hover:text-arduino-teal hover:bg-gray-100/50",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
    };

    const sizes = {
        sm: "py-1.5 px-3 text-sm rounded-lg",
        md: "py-2 px-6 text-base rounded-xl",
        lg: "py-3 px-8 text-lg rounded-2xl",
        icon: "p-2 w-10 h-10 rounded-xl flex items-center justify-center",
    };

    return (
        <button
            className={cn(
                "font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                isLoading && "opacity-70 cursor-wait",
                props.disabled && "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none",
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            )}
            {!isLoading && leftIcon}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}
