'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ConfirmPage() {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, digite seu email');
      return;
    }

    setIsResending(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('Erro ao reenviar email:', error);
        toast.error('Erro ao reenviar email. Verifique se o email está correto.');
      } else {
        toast.success('✅ Email reenviado! Verifique sua caixa de entrada e spam.');
        setShowResendForm(false);
      }
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      toast.error('Erro ao reenviar email. Tente novamente.');
    } finally {
      setIsResending(false);
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

              {/* Card de Ajuda - Email não chegou */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-left border border-blue-200 dark:border-blue-800">
                <p className="font-semibold mb-2 flex items-center gap-2 text-blue-900 dark:text-blue-300">
                  <AlertCircle className="w-4 h-4" />
                  Email não chegou?
                </p>
                <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200 ml-6">
                  <li>• Verifique sua <strong>pasta de spam/lixo</strong></li>
                  <li>• Aguarde até 5 minutos</li>
                  <li>• Alguns provedores (Hotmail, Outlook) podem bloquear</li>
                </ul>
              </div>

              {/* Botão Reenviar */}
              {!showResendForm ? (
                <button
                  onClick={() => setShowResendForm(true)}
                  className="text-sm text-primary hover:text-orange-600 font-semibold transition-colors underline"
                >
                  Reenviar email de confirmação
                </button>
              ) : (
                <form onSubmit={handleResendEmail} className="space-y-3 pt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu email"
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isResending}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-orange-600 px-4 py-2 text-sm font-bold text-white transition-all disabled:opacity-60"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Reenviar
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResendForm(false)}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
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
