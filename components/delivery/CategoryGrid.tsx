"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { listCategories, type Category } from '@/lib/delivery/categories';

/**
 * CategoryGrid - Grid de categorias em substituição ao carousel
 * Destaca "Copão & Drinks" e apresenta categorias em grid 2x2
 */
export function CategoryGrid() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const currentTag = searchParams.get('tag');
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
            <div className="space-y-4">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">Categorias</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    const isCopaoDrinksActive = currentTag === 'copao';

    return (
        <div className="space-y-4">
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">Categorias</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Copão & Drinks - Destaque em 2 colunas */}
                <Link
                    href={isCopaoDrinksActive ? '/delivery' : '/delivery?tag=copao'}
                    className={cn(
                        "col-span-2 p-6 md:p-8 rounded-2xl transition-all text-center group relative overflow-hidden",
                        isCopaoDrinksActive
                            ? "bg-gradient-to-br from-purple-600 to-pink-600 scale-105 shadow-2xl"
                            : "bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105 hover:shadow-xl"
                    )}
                >
                    {/* Efeito de brilho */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />

                    <div className="relative z-10">
                        <div className="text-5xl md:text-6xl mb-3">🍹</div>
                        <div className="font-black text-xl md:text-2xl text-white mb-1">
                            Copão & Drinks
                        </div>
                        <div className="text-sm md:text-base text-white/90 font-medium">
                            Até 3h da manhã
                        </div>
                        {isCopaoDrinksActive && (
                            <div className="mt-2 inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                                ✓ Selecionado
                            </div>
                        )}
                    </div>
                </Link>

                {/* Categorias regulares */}
                {categories.map((cat) => {
                    const isActive = currentCategory === cat.slug;
                    return (
                        <Link
                            key={cat.id}
                            href={isActive ? '/delivery' : `/delivery?category=${cat.slug}`}
                            className={cn(
                                "p-6 rounded-xl transition-all text-center border-2 group",
                                isActive
                                    ? "bg-orange-100 dark:bg-orange-900/20 border-orange-500 scale-105 shadow-lg"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:shadow-md hover:scale-105"
                            )}
                        >
                            <div className="text-4xl md:text-5xl mb-2">
                                {cat.icon || '📦'}
                            </div>
                            <div className={cn(
                                "font-bold text-sm md:text-base",
                                isActive
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400"
                            )}>
                                {cat.name}
                            </div>
                            {isActive && (
                                <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                                    ✓ Selecionado
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
