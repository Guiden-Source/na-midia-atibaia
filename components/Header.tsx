"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonClasses } from './Button';
import { SubscribeNotificationsButton } from './SubscribeNotificationsButton';
import { CartBadge } from './delivery/CartBadge';
import { createClient } from '@/lib/supabase/client';
import { isUserAdmin } from '@/lib/auth/admins';
import { User, LogOut, ShoppingBag, Moon, Sun, Search, X, Calendar, Ticket, HelpCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  isAdmin?: boolean;
};

export function Header({ isAdmin: isAdminProp }: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(isUserAdmin(session.user));
          fetchUnreadCount(session.user.id);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(isUserAdmin(session?.user ?? null));
      if (session?.user) fetchUnreadCount(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUnreadCount = async (userId: string) => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      setUnreadCount(count || 0);
    } catch (err) {
      setUnreadCount(0);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setShowDropdown(false);
    router.push('/');
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/evento?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`fixed left-0 right-0 top-4 z-40`}>
      <div className={`container mx-auto px-4 relative rounded-full border border-white/20 dark:border-white/10 backdrop-blur-xl backdrop-saturate-[180%] transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg' : 'bg-white/80 dark:bg-gray-900/80 shadow-md'}`}>
        <div className="relative flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center z-10">
            <img src="/logotiponamidiavetorizado.svg" alt="Na Mídia" className="h-10 w-auto" />
          </Link>

          <nav className="hidden lg:flex gap-2 text-sm items-center">
            <Link href="/" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all">Home</Link>
            <Link href="/evento" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all"><Calendar className="h-4 w-4" />Eventos</Link>
            <Link href="/cupons" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all"><Ticket className="h-4 w-4" />Cupons</Link>
            <Link href="/delivery" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all"><ShoppingBag className="h-4 w-4" />Delivery</Link>
            <Link href="/faq" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all"><HelpCircle className="h-4 w-4" />FAQ</Link>
            <Link href="/ajuda" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all"><Info className="h-4 w-4" />Ajuda</Link>
          </nav>

          <div className="flex gap-2 items-center">
            <button onClick={() => setShowSearch(!showSearch)} className={buttonClasses('outline') + ' flex items-center gap-2'} title="Buscar eventos"><Search className="h-4 w-4" /><span className="hidden md:inline">Buscar</span></button>
            <button onClick={toggleDarkMode} className={buttonClasses('outline') + ' flex items-center gap-2'} title={darkMode ? 'Modo claro' : 'Modo escuro'}>{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            <CartBadge />
            <div className="relative">
              <SubscribeNotificationsButton />
              {unreadCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md">{unreadCount > 9 ? '9+' : unreadCount}</span>)}
            </div>

            {loading ? (
              <div className={buttonClasses('primary') + ' flex items-center gap-2'}><div className="h-4 w-4 animate-pulse rounded-full bg-white/50" /></div>
            ) : user ? (
              <div className="relative">
                <button onClick={() => setShowDropdown(!showDropdown)} className={buttonClasses('primary') + ' flex items-center gap-2'} title={`Perfil de ${user.user_metadata?.full_name || user.email}`}><User className="h-4 w-4" /><span className="hidden sm:inline truncate max-w-[120px]">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Perfil'}</span></button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl border-2 border-white dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700"><p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.user_metadata?.full_name || 'Usuário'}</p><p className="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p></div>
                    <Link href="/perfil" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><User className="h-4 w-4" />Meu Perfil</Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><LogOut className="h-4 w-4" />Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={buttonClasses('primary')}>Entrar</Link>
            )}

          </div>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative container mx-auto px-4 mt-3">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar eventos, produtos..." className="w-full px-4 py-2 pl-10 pr-10 rounded-xl border-2 border-white bg-white/90 dark:bg-gray-800/90 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent" autoFocus />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <button type="button" onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><X className="h-5 w-5" /></button>
            </div>
          </form>
        )}
      </header>
  );
}
"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonClasses } from './Button';
import { SubscribeNotificationsButton } from './SubscribeNotificationsButton';
import { CartBadge } from './delivery/CartBadge';
import { createClient } from '@/lib/supabase/client';
import { isUserAdmin } from '@/lib/auth/admins';
import { User, LogOut, ShoppingBag, Moon, Sun, Search, X, Calendar, Ticket, HelpCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  isAdmin?: boolean;
};

export function Header({ isAdmin: isAdminProp }: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Dark Mode - persistir no localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.relative')) {
        setShowDropdown(false);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  useEffect(() => {
    const supabase = createClient();
    
    // Verificar usuário inicial
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(isUserAdmin(session.user));
          // Buscar contador de notificações não lidas
          fetchUnreadCount(session.user.id);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(isUserAdmin(session?.user ?? null));
      if (session?.user) {
        fetchUnreadCount(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Buscar contador de notificações não lidas
  const fetchUnreadCount = async (userId: string) => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      setUnreadCount(count || 0);
    } catch (err) {
      setUnreadCount(0);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setShowDropdown(false);
    router.push('/');
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/evento?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  // debug removed

  return (
    <>
      <header className={`fixed left-0 right-0 top-4 z-40`}>
        <div className={`container mx-auto px-4 relative rounded-full border border-white/20 dark:border-white/10 backdrop-blur-xl backdrop-saturate-[180%] transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg' : 'bg-white/80 dark:bg-gray-900/80 shadow-md'}`}>
          <div className="relative flex items-center justify-between px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center z-10">
              <img src="/logotiponamidiavetorizado.svg" alt="Na Mídia" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation - VISÍVEL EM TELAS >= 1024px */}
            <nav className="hidden lg:flex gap-2 text-sm items-center">
              <Link href="/" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all">
                Home
              </Link>
              <Link href="/evento" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all">
                <Calendar className="h-4 w-4" />
                Eventos
              </Link>
              <Link href="/cupons" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all">
                <Ticket className="h-4 w-4" />
                Cupons
              </Link>
              <Link href="/delivery" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all">
                <ShoppingBag className="h-4 w-4" />
                Delivery
              </Link>
              <Link href="/faq" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </Link>
              <Link href="/ajuda" className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all">
                <Info className="h-4 w-4" />
                Ajuda
              </Link>
            </nav>

          {/* Actions - SEMPRE VISÍVEIS */}
          <div className="flex gap-2 text-sm font-poppins items-center">
            {/* Search Button - NOVO! 🔍 */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={buttonClasses('outline') + ' flex items-center gap-2'}
              title="Buscar eventos"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Buscar</span>
            </button>

            {/* Dark Mode Toggle - NOVO! 🌙 */}
            <button
              onClick={toggleDarkMode}
              className={buttonClasses('outline') + ' flex items-center gap-2'}
              title={darkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <CartBadge />
            
            {/* Notifications with Badge */}
            <div className="relative">
              <SubscribeNotificationsButton />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>

            {/* User Menu */}
            {loading ? (
              <div className={buttonClasses('primary') + ' flex items-center gap-2'}>
                <div className="h-4 w-4 animate-pulse rounded-full bg-white/50" />
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={buttonClasses('primary') + ' flex items-center gap-2'}
                  title={`Perfil de ${user.user_metadata?.full_name || user.email}`}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline truncate max-w-[120px]">
                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Perfil'}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl border-2 border-white dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.user_metadata?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/perfil"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={buttonClasses('primary')}>
                Entrar
              </Link>
            )}
            
            {/* Admin Button */}
            {isAdmin && (
              <Link href="/admin" className={buttonClasses('outline')}>
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar (Collapsible) */}
        {showSearch && (
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar eventos, produtos..."
                className="w-full px-4 py-2 pl-10 pr-10 rounded-xl border-2 border-white bg-white/90 dark:bg-gray-800/90 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </form>
        )}
      </header>
    </>
  );
}
