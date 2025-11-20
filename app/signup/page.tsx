'use client';

import { signup } from './actions';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Sparkles, User, Phone } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SocialButtons } from '@/components/auth/SocialButton';

function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const isRateLimitError = error?.includes('rate limit') || error?.includes('Muitas tentativas');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await signup(formData);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-20 md:pt-24">
      {/* Animated CSS Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/20 to-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-pink-500/10 z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-xl shadow-2xl dark:bg-gray-900/80 dark:border-gray-800/50"
        >
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-200/50 dark:border-gray-800/50">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-4 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse bg-primary/20 blur-2xl rounded-full" />
                <Image
                  src="/logotiponamidiavetorizado.svg"
                  alt="Na Mídia"
                  width={120}
                  height={60}
                  className="relative h-auto w-32 drop-shadow-lg"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-2 font-baloo2 text-3xl font-extrabold text-gray-900 dark:text-white"
            >
              Crie sua conta
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Junte-se à comunidade Na Mídia
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 mt-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
            >
              <p className="font-semibold mb-1">❌ Erro ao criar conta</p>
              <p>{error}</p>
              {isRateLimitError && (
                <p className="mt-2 text-blue-600 dark:text-blue-400 font-medium">
                  💡 Dica: Use o botão "Continuar com Google" abaixo para criar sua conta instantaneamente!
                </p>
              )}
            </motion.div>
          )}

          {/* Social Login */}
          <div className="p-8 pb-10">
            <SocialButtons mode="signup" />

            {/* Info sobre Google */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 p-4"
            >
              <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                ✨ <strong>Login rápido e seguro</strong>
                <br />
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  Use sua conta Google para criar sua conta instantaneamente, sem necessidade de confirmação de email!
                </span>
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 pt-0 text-center space-y-3 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-800/50"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 pt-4">
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className="font-baloo2 font-semibold text-primary hover:text-orange-600 transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Extra info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          🔒 Seus dados estão protegidos com criptografia de ponta
        </motion.p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
