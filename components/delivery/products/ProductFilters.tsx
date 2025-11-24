'use client';

import { Search, Filter } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface ProductFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    categories: { id: string; name: string }[];
}

export function ProductFilters({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    statusFilter,
    onStatusChange,
    categories,
}: ProductFiltersProps) {
    return (
        <LiquidGlass className="p-4 mb-6" intensity={0.2}>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <div className="relative min-w-[150px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">Todas Categorias</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                    >
                        <option value="all">Todos Status</option>
                        <option value="active">Ativos</option>
                        <option value="inactive">Inativos</option>
                        <option value="featured">Destaques</option>
                    </select>
                </div>
            </div>
        </LiquidGlass>
    );
}
