"use client";

import { Search, MapPin, ChevronDown, Filter, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { AddressModal } from './AddressModal';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export function DeliveryHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [debouncedSearch] = useDebounce(searchQuery, 500);

    // Address State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('Jeronimo de Camargo, 123');

    // Update URL when debounced search changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        router.push(`/delivery?${params.toString()}`);
    }, [debouncedSearch, router, searchParams]);

    const clearSearch = () => {
        setSearchQuery('');
        router.push('/delivery');
    };

    return (
        <>
            <div className="sticky top-[72px] md:top-[80px] z-30 transition-all duration-200">
                <LiquidGlass className="rounded-none border-x-0 border-t-0 border-b border-white/20 dark:border-white/10 backdrop-blur-xl !bg-white/80 dark:!bg-black/80">
                    <div className="container mx-auto px-4 py-3 space-y-3">

                        {/* Top Row: Address Selector */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setIsAddressModalOpen(true)}
                                className="flex items-center gap-2 text-gray-800 dark:text-gray-100 hover:bg-black/5 dark:hover:bg-white/10 px-3 py-1.5 -ml-3 rounded-xl transition-all group"
                            >
                                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                    <MapPin size={16} />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Entregar em
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="font-baloo2 font-bold text-sm md:text-base truncate max-w-[200px] leading-none">
                                            {currentAddress}
                                        </span>
                                        <ChevronDown className="h-3 w-3 text-orange-500" />
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${isSearchFocused ? 'text-orange-500' : 'text-gray-400'}`} />
                            <input
                                id="delivery-search-input"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar pratos, restaurantes..."
                                className="w-full bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 rounded-2xl py-3.5 pl-12 pr-10 outline-none border-2 border-transparent focus:border-orange-500/50 focus:bg-white dark:focus:bg-gray-900 transition-all placeholder:text-gray-500 shadow-inner"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            <FilterButton icon={<Filter className="h-3 w-3" />} label="Filtros" />
                            <FilterButton label="Entrega Grátis" />
                            <FilterButton label="Prazo" />
                            <FilterButton icon={<Star className="h-3 w-3 text-yellow-500" />} label="4.5+" />
                            <FilterButton label="Promoções" />
                        </div>
                    </div>
                </LiquidGlass>
            </div>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSelect={setCurrentAddress}
                currentAddress={currentAddress}
            />
        </>
    );
}

function FilterButton({ label, icon }: { label: string; icon?: React.ReactNode }) {
    return (
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all active:scale-95 shadow-sm">
            {icon}
            {label}
        </button>
    );
}
