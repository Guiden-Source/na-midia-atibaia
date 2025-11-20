"use client";

import { X, Moon, Sun, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const pathname = usePathname();
    const [darkMode, setDarkMode] = useState(false);

    // Sync dark mode state
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setDarkMode(isDark);
    }, [isOpen]);

    const toggleDark = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
        if (newMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    // Close menu on route change
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <span className="font-baloo2 font-bold text-xl text-orange-500">Menu</span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-3">
                            <MenuItem href="/" label="Início" onClose={onClose} />
                            <MenuItem href="/#eventos" label="Eventos" onClose={onClose} />
                            <MenuItem href="/cupons" label="Cupons" onClose={onClose} />
                            <MenuItem href="/delivery" label="Delivery" active onClose={onClose} />
                            <MenuItem href="/faq" label="FAQ" onClose={onClose} />
                        </ul>
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                        <button
                            onClick={toggleDark}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                <span className="font-medium">Modo Escuro</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function MenuItem({ href, label, active, onClose }: { href: string; label: string; active?: boolean; onClose: () => void }) {
    return (
        <li>
            <Link
                href={href}
                onClick={onClose}
                className={`flex items-center justify-between p-3 rounded-xl transition-colors ${active
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
            >
                <span className="font-baloo2 text-lg">{label}</span>
                <ChevronRight className={`h-4 w-4 ${active ? 'text-orange-500' : 'text-gray-400'}`} />
            </Link>
        </li>
    );
}
