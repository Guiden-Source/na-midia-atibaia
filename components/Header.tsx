"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonClasses } from './Button';
import { CartBadge } from './delivery/CartBadge';
import { Moon, Sun, Search, X, User, Menu, ShoppingBag, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

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

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
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
    <header className="fixed left-0 right-0 top-4 z-40">
      <div className={`container mx-auto px-4 py-2 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-xl transition-all ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg' : 'bg-white/80 dark:bg-gray-900/80'}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logotiponamidiavetorizado.svg"
              alt="Na Mídia"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto dark:brightness-0 dark:invert"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/#eventos" className={buttonClasses('ghost')}>
              Eventos
            </Link>
            <Link href="/delivery" className={buttonClasses('ghost')}>
              <ShoppingBag className="h-4 w-4" />
              Delivery
            </Link>
            <Link href="/promocoes" className={buttonClasses('ghost')}>
              <Gift className="h-4 w-4" />
              Promoções
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch((s) => !s)}
              className={buttonClasses('outline')}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Buscar</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className={buttonClasses('outline')}
              aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile Link (Desktop) */}
            {user && (
              <Link
                href="/perfil"
                className={`${buttonClasses('outline')} hidden sm:flex`}
                aria-label="Perfil"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Perfil</span>
              </Link>
            )}

            {/* Cart Badge */}
            <CartBadge />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`${buttonClasses('outline')} lg:hidden`}
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <form onSubmit={onSearch} className="mt-3">
            <div className="relative">
              <input
                className="w-full rounded-xl px-4 py-2 pl-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Buscar eventos, produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <button
                type="button"
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Fechar busca"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <nav className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Link
              href="/#eventos"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              📅 Eventos
            </Link>
            <Link
              href="/delivery"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              🛍️ Delivery
            </Link>
            <Link
              href="/promocoes"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              🎁 Promoções
            </Link>
            {user && (
              <Link
                href="/perfil"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                👤 Perfil
              </Link>
            )}
            {!user && (
              <Link
                href="/login"
                className="block px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-center transition-transform hover:scale-[1.02]"
                onClick={() => setShowMobileMenu(false)}
              >
                Entrar / Cadastrar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
