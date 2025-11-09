'use client';

import { useState, useTransition, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ConfirmPresenceModalProps {
  eventName: string;
  onConfirm: () => Promise<{ success: boolean; error?: string | null }>;
  onClose: () => void;
}

export default function ConfirmPresenceModal({ eventName, onConfirm, onClose }: ConfirmPresenceModalProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Carregar dados do usuário
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
      setIsLoadingUser(false);
    };
    loadUser();
  }, []);

  const handleConfirm = () => {
    setError(null);
    setStatus('idle');

    startTransition(async () => {
      const result = await onConfirm();
      if (result.success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatus('error');
        setError(result.error || 'Ocorreu um erro desconhecido.');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card border-2 border-primary/50 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-righteous text-foreground mb-2">
              Presença Confirmada!
            </h3>
            <p className="text-muted-foreground mb-4">
              Seu cupom de bebida foi gerado com sucesso 🎉
            </p>
            <p className="text-sm text-muted-foreground">
              Verifique sua lista de cupons no perfil
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-righteous text-foreground mb-2">
                Confirmar Presença
              </h2>
              <p className="text-muted-foreground mb-1">
                <span className="font-bold text-foreground">{eventName}</span>
              </p>
              {isLoadingUser ? (
                <p className="text-sm text-muted-foreground mt-4">
                  <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
                  Carregando seus dados...
                </p>
              ) : (
                <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <p className="text-sm font-medium text-foreground mb-2">
                    👤 <strong className="text-primary">{userName}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    🎁 Você receberá um cupom exclusivo de bebida válido após o evento!
                  </p>
                </div>
              )}
            </div>

            {status === 'error' && error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleConfirm}
                disabled={isPending || isLoadingUser}
                aria-label="Confirmar presença e gerar cupom"
                className="w-full px-6 py-4 min-h-[52px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-baloo2 font-bold text-base rounded-xl hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Confirmando Presença...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Confirmar e Gerar Cupom
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                aria-label="Cancelar"
                className="w-full px-6 py-3 text-muted-foreground font-baloo2 font-semibold text-sm hover:text-foreground transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
