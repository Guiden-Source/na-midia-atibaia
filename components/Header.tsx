"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonClasses } from './Button';
import { SubscribeNotificationsButton } from './SubscribeNotificationsButton';
import { createClient } from '@/lib/supabase/client';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  isAdmin?: boolean; // Placeholder para futuro auth
};

export function Header({ isAdmin = true }: HeaderProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔐 Header - Session check:', {
          hasSession: !!session,
          error: sessionError,
          user: session?.user?.email
        });
        
        if (session?.user) {
          console.log('🔐 Header - User data:', {
            email: session.user.email,
            metadata: session.user.user_metadata,
            id: session.user.id
          });
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('🔐 Header - Error checking user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔐 Header - Auth state changed:', {
        event: _event,
        hasUser: !!session?.user,
        email: session?.user?.email
      });
      
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    console.log('🔐 Header - Logging out...');
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className={`mb-6 sticky top-0 z-40 flex items-center justify-between px-6 py-4 rounded-2xl border-[3px] border-white shadow-retro backdrop-blur-sm transition ${scrolled ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800]' : 'bg-gradient-to-r from-[#FF9800] to-[#FF5722]'}`}>
      <Link href="/" className="font-righteous text-3xl text-white drop-shadow-[0_4px_0_#FFFFFF] tracking-wide">
        Na <span className="text-accent">Mídia</span>
      </Link>
      <nav className="flex gap-3 text-sm font-poppins items-center">
        <Link href="/" className={buttonClasses('outline') + ' hidden sm:inline-block'}>Home</Link>
        <SubscribeNotificationsButton />
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
        {isAdmin && (
          <Link href="/admin" className={buttonClasses('outline')}>Admin</Link>
        )}
      </nav>
    </header>
  );
}
