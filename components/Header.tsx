"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CartBadge } from './delivery/CartBadge';
import { Moon, Sun, Search, X, User, Menu, ShoppingBag, Gift, LogOut, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    const fetchUser = async () => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    window.location.reload();
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/evento?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário';

  return (
    <header className="fixed left-0 right-0 top-2 md:top-4 z-40 px-3 md:px-4">
      <div className={`w-full md:container md:mx-auto px-4 md:px-6 py-3 md:py-3.5 rounded-2xl md:rounded-full border border-orange-200/30 dark:border-orange-900/30 backdrop-blur-xl transition-all duration-300 ${scrolled
        ? 'bg-white/98 dark:bg-gray-900/98 shadow-xl shadow-orange-500/5'
        : 'bg-white/90 dark:bg-gray-900/90 shadow-lg'
        }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
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
            <Link
              href="/#eventos"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
            >
              Eventos
            </Link>
            <Link
              href="/delivery"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Delivery
            </Link>
            {/* Promoções removido temporariamente */}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch((s) => !s)}
              className="hidden lg:block p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
              aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Cart Badge */}
            <CartBadge />

            {/* User Menu (Desktop) */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium text-sm hover:shadow-lg transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{userName}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <Link
                      href="/perfil"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Meu Perfil</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium text-sm hover:shadow-lg transition-all"
              >
                Entrar
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <form onSubmit={onSearch} className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                className="w-full rounded-xl px-4 py-2.5 pl-10 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Buscar eventos, produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <button
                type="button"
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Fechar busca"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <nav className="lg:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-900 dark:text-white font-medium transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              <Home className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Home
            </Link>
            <Link
              href="/#eventos"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-900 dark:text-white font-medium transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="text-xl">📅</span>
              Eventos
            </Link>
            <Link
              href="/delivery"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-900 dark:text-white font-medium transition-colors"
              onClick={() => setShowMobileMenu(false)}
            >
              <ShoppingBag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Delivery
            </Link>
            {/* Promoções removido temporariamente */}

            {user ? (
              <>
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-900 dark:text-white font-medium transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <User className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Meu Perfil
                </Link>
                <button
                  onClick={() => { handleLogout(); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium transition-colors text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold transition-transform hover:scale-[1.02]"
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
