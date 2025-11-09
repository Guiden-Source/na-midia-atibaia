'use client';

import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ConfirmPage() {
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
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse bg-green-500/20 blur-2xl rounded-full" />
                <CheckCircle2 className="relative h-20 w-20 text-green-500 drop-shadow-lg" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 font-baloo2 text-3xl font-extrabold text-gray-900 dark:text-white"
            >
              Verifique seu email!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-blue-600 dark:text-blue-400">
                <Mail className="h-5 w-5" />
                <span className="font-semibold">Email de confirmação enviado</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                Enviamos um link de confirmação para seu email.
              </p>

              <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 text-sm text-gray-700 dark:text-gray-300 border border-orange-200 dark:border-orange-800">
                <p className="font-semibold mb-2">Próximos passos:</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Abra seu email</li>
                  <li>Clique no link de confirmação</li>
                  <li>Volte aqui e faça login</li>
                </ol>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Não recebeu o email? Verifique sua pasta de spam.
              </p>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 text-center border-t border-gray-200/50 dark:border-gray-800/50 space-y-3"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-orange-600 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              Ir para o login
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              ou{' '}
              <Link
                href="/"
                className="font-baloo2 font-semibold text-primary hover:text-orange-600 transition-colors"
              >
                voltar para a página inicial
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
