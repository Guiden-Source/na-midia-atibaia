'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCcw, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logotiponamidiavetorizado.svg"
            alt="Na Mídia"
            width={200}
            height={100}
            className="h-auto w-40 drop-shadow-2xl"
            priority
          />
        </div>

        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-6">
            <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="mb-4 font-baloo2 text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Algo deu errado!
        </h1>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Ocorreu um erro inesperado. Não se preocupe, nossa equipe já foi notificada. Tente novamente em instantes.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 mx-auto max-w-xl rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4">
            <p className="text-sm text-left font-mono text-red-800 dark:text-red-300 break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-baloo2 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:bg-orange-600 active:scale-95"
          >
            <RefreshCcw className="h-5 w-5 transition-transform group-hover:rotate-180" />
            Tentar Novamente
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white/80 backdrop-blur-sm px-6 py-3 font-baloo2 text-lg font-semibold text-orange-700 transition-all hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95 dark:bg-gray-800/80 dark:text-orange-400 dark:hover:bg-gray-800"
          >
            <Home className="h-5 w-5" />
            Ir para Home
          </Link>
        </div>

        {/* Error digest (if available) */}
        {error.digest && (
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            ID do erro: <span className="font-mono">{error.digest}</span>
          </p>
        )}
      </div>
    </div>
  );
}
