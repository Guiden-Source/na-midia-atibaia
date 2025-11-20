"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { buttonClasses } from './Button';
import { CartBadge } from './delivery/CartBadge';
import { Moon, Sun, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeaderClean() {
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
    <header className="fixed left-0 right-0 top-4 z-40">
      <div className={`container mx-auto px-4 py-2 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-xl transition ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg' : 'bg-white/80 dark:bg-gray-900/80'}`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logotiponamidiavetorizado.svg" alt="Na Mídia" className="h-10" />
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowSearch((s) => !s)} className={buttonClasses('outline')}> <Search className="h-4 w-4" /> <span className="hidden md:inline">Buscar</span></button>
            <button onClick={toggleDark} className={buttonClasses('outline')}>{darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
            <CartBadge />
          </div>
        </div>

        {showSearch && (
          <form onSubmit={onSearch} className="mt-3">
            <div className="relative">
              <input className="w-full rounded-xl px-4 py-2 pl-10 border" placeholder="Buscar eventos, produtos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <button type="button" onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-5 w-5" /></button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
