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

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await signup(formData);
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
              {error}
            </motion.div>
          )}

          {/* Social Login */}
          <div className="px-8 pt-6">
            <SocialButtons mode="signup" />
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                  Ou continue com email
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            action={handleSubmit}
            className="p-8 space-y-5"
          >
            {/* Nome Completo */}
            <div className="space-y-2">
              <label
                htmlFor="full_name"
                className="block text-sm font-baloo2 font-semibold text-gray-700 dark:text-gray-300"
              >
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-baloo2 font-semibold text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-baloo2 font-semibold text-gray-700 dark:text-gray-300"
              >
                Telefone (opcional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="(11) 98888-8888"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-baloo2 font-semibold text-gray-700 dark:text-gray-300"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use no mínimo 6 caracteres
              </p>
            </div>

            {/* Info sobre confirmação de email */}
            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                📧 <strong>Importante:</strong> Você receberá um email de confirmação. Verifique sua <strong>caixa de spam</strong> se não receber em alguns minutos!
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-orange-600 px-6 py-3 font-baloo2 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 text-center border-t border-gray-200/50 dark:border-gray-800/50"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
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
