// Utility function để merge class names
// Kết hợp clsx và tailwind-merge để xử lý conditional classes và loại bỏ conflict

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
