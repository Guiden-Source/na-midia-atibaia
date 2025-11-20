"use client";

import { X, Moon, Sun, ChevronRight, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/auth/hooks';
import { createClient } from '@/lib/supabase/client';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const pathname = usePathname();
    const [darkMode, setDarkMode] = useState(false);
    const { user, loading } = useUser();
    const supabase = createClient();

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onClose();
        window.location.reload();
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

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Visitante';

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
                    {/* Header with User Info */}
                    <div className="p-6 bg-orange-500 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-baloo2 font-bold text-xl">Menu</span>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {!loading && (
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <UserIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-orange-100">Olá,</p>
                                    <p className="font-bold text-lg leading-tight truncate max-w-[160px]">{userName}</p>
                                </div>
                            </div>
                        )}
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
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
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

                        {!loading && (
                            user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Sair</span>
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                >
                                    <LogIn className="h-5 w-5" />
                                    <span className="font-medium">Entrar / Criar Conta</span>
                                </Link>
                            )
                        )}
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
