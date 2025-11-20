"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CartBadge } from './delivery/CartBadge';
import { Moon, Sun, Search, X, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeaderFinal() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/evento?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 md:top-4 z-40 px-3 md:px-4">
      <div className={`w-full md:container md:mx-auto px-4 md:px-6 py-3 md:py-3.5 md:rounded-full border-b md:border border-orange-200/30 dark:border-orange-900/30 backdrop-blur-xl transition-all duration-300 ${
        scrolled 
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
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
            >
              Eventos
            </Link>
            <Link 
              href="/cupons" 
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
            >
              Cupons
            </Link>
            <Link 
              href="/delivery" 
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
            >
              Delivery
            </Link>
            <Link 
              href="/faq" 
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button 
              onClick={() => setShowSearch((s) => !s)} 
              className="inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Buscar</span>
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDark} 
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={darkMode ? "Modo claro" : "Modo escuro"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Cart Badge */}
            <CartBadge />
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <form onSubmit={onSearch} className="mt-4 animate-in slide-in-from-top-2 duration-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                className="w-full rounded-xl pl-12 pr-12 py-3 border-2 border-orange-200 dark:border-orange-900/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" 
                placeholder="Buscar eventos, produtos..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => { setShowSearch(false); setSearchQuery(''); }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Fechar busca"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
