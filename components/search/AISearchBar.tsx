'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSearchSuggestions } from '@/lib/search/intelligentSearch';
import { cn } from '@/lib/utils';

type AISearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
};

export function AISearchBar({ onSearch, placeholder = 'Pergunte ao nosso assistente inteligente...', className }: AISearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gerar sugestões conforme o usuário digita
  useEffect(() => {
    if (query.length >= 2) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        const newSuggestions = generateSearchSuggestions(query);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
        setIsTyping(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsTyping(false);
    }
  }, [query]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-3xl mx-auto', className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative group">
          {/* AI Badge */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>IA</span>
            </div>
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-24 pr-28 py-5 rounded-2xl',
              'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
              'border-2 border-gray-200 dark:border-gray-700',
              'focus:border-orange-500 dark:focus:border-orange-500',
              'focus:ring-4 focus:ring-orange-500/20',
              'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
              'text-base md:text-lg font-medium',
              'transition-all duration-300',
              'shadow-lg hover:shadow-xl',
              'group-hover:border-orange-400 dark:group-hover:border-orange-600'
            )}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-20 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={!query.trim()}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'px-6 py-2.5 rounded-xl',
              'bg-gradient-to-r from-orange-500 to-pink-500',
              'text-white font-semibold',
              'shadow-lg hover:shadow-xl',
              'transition-all duration-300',
              'hover:scale-105 active:scale-95',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
              'flex items-center gap-2'
            )}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (suggestions.length > 0 || isTyping) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
            >
              {isTyping ? (
                <div className="p-4 flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Analisando sua busca...</span>
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sugestões inteligentes
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center gap-3 group"
                    >
                      <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-900 dark:text-white font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Example Searches */}
      {!query && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['pagode hoje', 'sertanejo fim de semana', 'festa com cerveja', 'show ao vivo'].map((example) => (
            <button
              key={example}
              onClick={() => {
                setQuery(example);
                handleSearch(example);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
