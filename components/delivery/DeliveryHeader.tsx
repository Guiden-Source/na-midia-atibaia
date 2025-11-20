"use client";

import { Search, MapPin, ChevronDown, Filter, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { AddressModal } from './AddressModal';

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
            <div className="sticky top-[72px] md:top-[110px] z-30 bg-white dark:bg-gray-900 shadow-sm transition-all duration-200">
                <div className="container mx-auto px-4 py-3 space-y-3">

                    {/* Top Row: Address Selector */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsAddressModalOpen(true)}
                            className="flex items-center gap-1.5 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 -ml-1.5 rounded-lg transition-colors group"
                        >
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-orange-500">
                                Entregar em
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-sm md:text-base truncate max-w-[200px]">
                                    {currentAddress}
                                </span>
                                <ChevronDown className="h-4 w-4 text-orange-500" />
                            </div>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${isSearchFocused ? 'text-orange-500' : 'text-gray-400'}`} />
                        <input
                            id="delivery-search-input"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar pratos, restaurantes..."
                            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all placeholder:text-gray-500"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:hover:border-orange-800 transition-colors active:scale-95">
            {icon}
            {label}
        </button>
    );
}
