"use client";

import { Home, Search, ShoppingBag, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { useCart } from '@/lib/delivery/CartContext';

export function BottomNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems } = useCart();

    const handleSearchClick = () => {
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Focus on search input (we'll need to add an ID to the input in DeliveryHeader)
        setTimeout(() => {
            const searchInput = document.getElementById('delivery-search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }, 300);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-40 lg:hidden">
                <div className="flex items-center justify-around h-16">
                    <Link
                        href="/delivery"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/delivery') ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <Home className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Início</span>
                    </Link>

                    <button
                        onClick={handleSearchClick}
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                        <Search className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Buscar</span>
                    </button>

                    <Link
                        href="/delivery/cart"
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${isActive('/delivery/cart') ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <div className="relative">
                            <ShoppingBag className="h-6 w-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium">Carrinho</span>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isMenuOpen ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <Menu className="h-6 w-6" />
                        <span className="text-[10px] font-medium">Menu</span>
                    </button>
                </div>
            </div>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
