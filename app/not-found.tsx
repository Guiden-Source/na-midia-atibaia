"use client";
import Link from 'next/link';
import { Home, Search, ArrowLeft, Compass } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-20">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-50" />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

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

          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 p-6 shadow-xl">
              <Compass className="h-16 w-16 text-orange-600 dark:text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </motion.div>

          {/* 404 Number */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="mb-6 font-baloo2 text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Página Não Encontrada
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto"
          >
            Ops! A página que você está procurando não existe ou foi movida. Que tal voltar aos eventos?
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-8 py-4 font-baloo2 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Ir para Home
            </Link>

            <Link
              href="/delivery"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 bg-white/80 backdrop-blur-sm px-8 py-4 font-baloo2 text-lg font-semibold text-orange-700 transition-all hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95 dark:bg-gray-800/80 dark:text-orange-400 dark:hover:bg-gray-800"
            >
              <Search className="h-5 w-5" />
              Ver Cardápio
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-baloo2 font-semibold">
              Links Úteis:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link href="/delivery" className="text-orange-600 dark:text-orange-400 hover:underline">
                Delivery
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link href="/promocoes" className="text-orange-600 dark:text-orange-400 hover:underline">
                Promoções
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link href="/perfil" className="text-orange-600 dark:text-orange-400 hover:underline">
                Meu Perfil
              </Link>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <Link href="/ajuda" className="text-orange-600 dark:text-orange-400 hover:underline">
                Ajuda
              </Link>
            </div>
          </motion.div>

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
