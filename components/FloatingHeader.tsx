"use client";

import { useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { Home, Calendar, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NotificationButton } from "@/components/NotificationButton";

export function FloatingHeader() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    const supabase = createClient();
    
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('🔐 FloatingHeader - Session check:', {
          hasSession: !!session,
          error: sessionError,
          user: session?.user?.email
        });
        
        if (session?.user) {
          console.log('🔐 FloatingHeader - User data:', {
            email: session.user.email,
            metadata: session.user.user_metadata,
            id: session.user.id
          });
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('🔐 FloatingHeader - Error checking user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔐 FloatingHeader - Auth state changed:', {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleLogout = async () => {
    const supabase = createClient();
    console.log('🔐 FloatingHeader - Logging out...');
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 pt-4">
        {/* Desktop Header */}
        <div
          className={`
            hidden md:block
            relative rounded-full
            border border-white/20 dark:border-white/10
            backdrop-blur-xl backdrop-saturate-[180%]
            transition-all duration-300
            ${isScrolled 
              ? "bg-white/95 dark:bg-gray-900/95 shadow-lg" 
              : "bg-white/80 dark:bg-gray-900/80 shadow-md"
            }
          `}
        >
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
            }}
          />
          
          <div className="relative flex items-center justify-between px-6 py-4">
            <Link 
              href="/" 
              className="flex items-center transition-transform hover:scale-105 active:scale-95 z-10"
            >
              <img 
                src="/logotiponamidiavetorizado.svg" 
                alt="Na Mídia" 
                className="h-10 w-auto"
              />
            </Link>

            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-300 transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Eventos</span>
              </Link>

              {/* Botão de Notificações */}
              <NotificationButton />
              
              {loading ? (
                <div className="flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-white/50" />
                </div>
              ) : user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all ml-2"
                  >
                    <User className="w-5 h-5" />
                    <span className="max-w-[120px] truncate">
                      {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Perfil'}
                    </span>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border-2 border-white dark:border-gray-700 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user.user_metadata?.full_name || 'Usuário'}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/perfil"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-5 w-5" />
                        Meu Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-bold border-2 border-orange-500 text-orange-600 dark:text-orange-400 dark:border-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Criar Conta</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full font-baloo2 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span>Entrar</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div
            className={`
              relative rounded-3xl
              border border-white/20 dark:border-white/10
              backdrop-blur-xl backdrop-saturate-[180%]
              transition-all duration-300
              ${isScrolled 
                ? "bg-white/95 dark:bg-gray-900/95 shadow-lg" 
                : "bg-white/80 dark:bg-gray-900/80 shadow-md"
              }
            `}
          >
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
              }}
            />
            
            <div className="relative flex items-center justify-between px-4 py-4">
              <Link href="/" className="flex items-center">
                <img 
                  src="/logotiponamidiavetorizado.svg" 
                  alt="Na Mídia" 
                  className="h-8 w-auto"
                />
              </Link>

              {loading ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                  <div className="h-4 w-4 animate-pulse rounded-full bg-white/50" />
                </div>
              ) : user ? (
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-baloo2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[80px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Perfil'}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signup"
                    className="flex items-center px-4 py-2 rounded-full font-baloo2 text-sm font-bold border-2 border-orange-500 text-orange-600 dark:text-orange-400 dark:border-orange-400 hover:bg-orange-500 hover:text-white active:scale-95 transition-all"
                  >
                    Criar Conta
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-baloo2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Entrar</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
