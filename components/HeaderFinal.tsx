"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CartBadge } from './delivery/CartBadge';
import { Moon, Sun, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth/hooks';
import { createClient } from '@/lib/supabase/client';
import { User, LogOut, LogIn, ChevronDown } from 'lucide-react';

export default function HeaderFinal() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add('dark');
  }, []);

  const toggleDark = () => {
    const nm = !darkMode;
    setDarkMode(nm);
    localStorage.setItem('darkMode', String(nm));
    if (nm) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    window.location.reload();
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Visitante';

  return (
    <header className="fixed left-0 right-0 top-2 md:top-4 z-40 px-3 md:px-4">
      <div className={`w-full md:container md:mx-auto px-4 md:px-6 py-3 md:py-3.5 rounded-2xl md:rounded-full border border-orange-200/30 dark:border-orange-900/30 backdrop-blur-xl transition-all duration-300 ${scrolled
        ? 'bg-white/98 dark:bg-gray-900/98 shadow-xl shadow-orange-500/5'
        : 'bg-white/95 dark:bg-gray-900/95 shadow-lg'
        }`}>
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/logotiponamidiavetorizado.svg"
              alt="Na Mídia"
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/#eventos"
              className="px-4 py-2 text-base font-baloo2 font-bold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-xl transition-colors"
            >
              Eventos
            </Link>
            <Link
              href="/cupons"
              className="px-4 py-2 text-base font-baloo2 font-bold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-xl transition-colors"
            >
              Cupons
            </Link>
            <Link
              href="/delivery"
              className="px-4 py-2 text-base font-baloo2 font-bold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-xl transition-colors"
            >
              Delivery
            </Link>
            <Link
              href="/faq"
              className="px-4 py-2 text-base font-baloo2 font-bold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-xl transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={darkMode ? "Modo claro" : "Modo escuro"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Cart Badge */}
            <CartBadge />

            {/* User Menu (Desktop) */}
            <div className="hidden lg:block relative">
              {!loading && (
                user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                      <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                        {userName}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {/* Dropdown */}
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Logado como</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sair
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
