"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CartBadge } from './delivery/CartBadge';
import { Moon, Sun, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeaderFinal() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
          </div>
        </div>
      </div>
    </header>
  );
}
