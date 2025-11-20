'use client';

import { login } from './actions';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SocialButtons } from '@/components/auth/SocialButton';

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      // Traduzir mensagens de erro comuns
      if (error.includes('Invalid login credentials')) {
        setErrorMessage('Email ou senha incorretos. Verifique seus dados e tente novamente.');
      } else if (error.includes('Email not confirmed')) {
        setErrorMessage('Por favor, confirme seu email antes de fazer login.');
      } else {
        setErrorMessage('Erro ao fazer login. Tente novamente.');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const formData = new FormData(e.currentTarget);
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
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
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-2 font-baloo2 text-3xl font-extrabold text-gray-900 dark:text-white"
            >
              Bem-vindo!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Acesse sua conta Na Mídia
            </motion.p>
          </div>

          {/* Social Login */}
          <div className="p-8 pb-10">
            <SocialButtons mode="signin" />

            {/* Info sobre Google */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 p-4"
            >
              <p className="text-sm text-green-900 dark:text-green-200 text-center">
                🔒 <strong>Login Seguro</strong>
                <br />
                <span className="text-xs text-green-700 dark:text-green-300">
                  Para sua segurança e facilidade, utilizamos apenas o login com Google. Não é necessário decorar senhas!
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
            <p className="text-xs text-gray-500 dark:text-gray-500 pt-4">
              <a
                href="/"
                className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-3 w-3 rotate-180" />
                Voltar para home
              </a>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
