"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { listCategories, type Category } from '@/lib/delivery/categories';

export function CategoryCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            const result = await listCategories();
            if (result.success && result.categories) {
                // Filter only active categories and sort by display_order
                const activeCategories = result.categories
                    .filter(cat => cat.is_active)
                    .sort((a, b) => a.display_order - b.display_order);
                setCategories(activeCategories);
            }
            setLoading(false);
        };
        loadCategories();
    }, []);

    if (loading) {
        return (
            <div className="py-6">
                <div className="px-4 mb-3">
                    <h2 className="font-bold text-lg text-gray-900 dark:text-white">Categorias</h2>
                </div>
                <div className="flex gap-6 overflow-x-auto px-4 pb-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 min-w-[88px] animate-pulse">
                            <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                            <div className="w-16 h-3 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return null; // Don't show category section if no categories
    }

    return (
        <div className="py-6">
            <div className="px-4 mb-3">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Categorias</h2>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x"
            >
                {categories.map((cat) => {
                    const isActive = currentCategory === cat.slug;
                    return (
                        <Link
                            key={cat.id}
                            href={isActive ? '/delivery' : `/delivery?category=${cat.slug}`}
                            className="flex flex-col items-center gap-2 min-w-[88px] snap-start group"
                        >
                            <div className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-sm transition-all duration-200 border",
                                isActive
                                    ? "bg-orange-100 dark:bg-orange-900/20 border-orange-500 scale-105 shadow-md"
                                    : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 group-hover:border-orange-200 dark:group-hover:border-orange-900 group-hover:shadow-md group-hover:scale-105"
                            )}>
                                {cat.icon || '📦'}
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors text-center",
                                isActive
                                    ? "text-orange-600 dark:text-orange-400 font-bold"
                                    : "text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                            )}>
                                {cat.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
