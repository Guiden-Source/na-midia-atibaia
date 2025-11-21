'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCcw, AlertTriangle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-20">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-50" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <LiquidGlass className="p-8 sm:p-12 text-center" intensity={0.3}>
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <Image
              src="/logotiponamidiavetorizado.svg"
              alt="Na Mídia"
              width={200}
              height={100}
              className="h-auto w-40 drop-shadow-2xl dark:brightness-0 dark:invert"
              priority
            />
          </motion.div>

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 p-6 shadow-xl">
              <AlertTriangle className="h-16 w-16 text-red-600 dark:text-red-400 animate-pulse" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 font-baloo2 text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Algo deu errado!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto"
          >
            Ocorreu um erro inesperado. Não se preocupe, nossa equipe já foi notificada. Tente novamente em instantes.
          </motion.p>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8 mx-auto max-w-xl"
            >
              <LiquidGlass className="p-4 bg-red-50/50 dark:bg-red-900/10" intensity={0.2}>
                <p className="text-sm text-left font-mono text-red-800 dark:text-red-300 break-words">
                  {error.message}
                </p>
              </LiquidGlass>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={reset}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 font-baloo2 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <RefreshCcw className="h-5 w-5 transition-transform group-hover:rotate-180 duration-500" />
              Tentar Novamente
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 bg-white/80 backdrop-blur-sm px-8 py-4 font-baloo2 text-lg font-semibold text-orange-700 transition-all hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95 dark:bg-gray-800/80 dark:text-orange-400 dark:hover:bg-gray-800"
            >
              <Home className="h-5 w-5" />
              Ir para Home
            </Link>
          </motion.div>

          {/* Error digest (if available) */}
          {error.digest && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              ID do erro: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{error.digest}</span>
            </motion.p>
          )}

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-baloo2 font-semibold">Voltar</span>
          </motion.button>
        </LiquidGlass>
      </motion.div>
    </div>
  );
}
