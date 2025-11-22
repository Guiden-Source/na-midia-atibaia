"use client";

import Link from 'next/link';
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

// Mock data - replace with real props later
const CATEGORIES = [
    { id: 1, name: 'Lanches', image: '🍔', slug: 'lanches' },
    { id: 2, name: 'Pizza', image: '🍕', slug: 'pizza' },
    { id: 3, name: 'Japonesa', image: '🍣', slug: 'japonesa' },
    { id: 4, name: 'Brasileira', image: '🥘', slug: 'brasileira' },
    { id: 5, name: 'Açaí', image: '🍧', slug: 'acai' },
    { id: 6, name: 'Doces', image: '🍰', slug: 'doces' },
    { id: 7, name: 'Bebidas', image: '🥤', slug: 'bebidas' },
    { id: 8, name: 'Saudável', image: '🥗', slug: 'saudavel' },
];

export function CategoryCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    return (
        <div className="py-6">
            <div className="px-4 mb-3">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Categorias</h2>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x"
            >
                {CATEGORIES.map((cat) => {
                    const isActive = currentCategory === cat.slug;
                    return (
                        <Link
                            key={cat.id}
                            href={isActive ? '/delivery' : `/delivery?category=${cat.slug}`}
                            className="flex flex-col items-center gap-2 min-w-[80px] snap-start group"
                        >
                            <div className={cn(
                                "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-sm transition-all duration-200 border",
                                isActive
                                    ? "bg-orange-100 dark:bg-orange-900/20 border-orange-500 scale-105 shadow-md"
                                    : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 group-hover:border-orange-200 dark:group-hover:border-orange-900 group-hover:shadow-md group-hover:scale-105"
                            )}>
                                {cat.image}
                            </div>
                            <span className={cn(
                                "text-xs font-medium transition-colors",
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
