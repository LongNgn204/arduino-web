// LoadingSpinner.test.tsx - Unit tests cho Loading components

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
    LoadingSpinner,
    PageLoading,
    CardSkeleton,
    ListItemSkeleton,
    GridSkeleton,
    LessonSkeleton
} from '../components/LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders spinner without text', () => {
        const { container } = render(<LoadingSpinner />);
        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders spinner with text', () => {
        render(<LoadingSpinner text="Loading..." />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('applies correct size class for sm', () => {
        const { container } = render(<LoadingSpinner size="sm" />);
        expect(container.querySelector('.w-6')).toBeInTheDocument();
    });

    it('applies correct size class for lg', () => {
        const { container } = render(<LoadingSpinner size="lg" />);
        expect(container.querySelector('.w-16')).toBeInTheDocument();
    });
});

describe('PageLoading', () => {
    it('renders full page loading with text', () => {
        render(<PageLoading />);
        expect(screen.getByText('Đang tải...')).toBeInTheDocument();
    });
});

describe('Skeleton components', () => {
    it('renders CardSkeleton with animation', () => {
        const { container } = render(<CardSkeleton />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders ListItemSkeleton', () => {
        const { container } = render(<ListItemSkeleton />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders GridSkeleton with correct count', () => {
        const { container } = render(<GridSkeleton count={3} />);
        const cards = container.querySelectorAll('.animate-pulse');
        expect(cards).toHaveLength(3);
    });

    it('renders GridSkeleton with default count of 6', () => {
        const { container } = render(<GridSkeleton />);
        const cards = container.querySelectorAll('.animate-pulse');
        expect(cards).toHaveLength(6);
    });

    it('renders LessonSkeleton', () => {
        const { container } = render(<LessonSkeleton />);
        expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });
});
