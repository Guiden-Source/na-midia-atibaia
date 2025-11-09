'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  initOneSignal,
  isUserSubscribed,
  requestNotificationPermission,
  unsubscribeFromNotifications,
  isOneSignalEnabled,
} from '@/lib/onesignal';

export function NotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Verificar se OneSignal está configurado
      if (!isOneSignalEnabled()) {
        setIsLoading(false);
        return;
      }

      // Inicializar OneSignal
      const initialized = await initOneSignal();
      setIsInitialized(initialized);

      if (initialized) {
        // Verificar status de inscrição
        const subscribed = await isUserSubscribed();
        setIsSubscribed(subscribed);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const handleToggleNotifications = async () => {
    if (!isInitialized) {
      toast.error('Sistema de notificações não está disponível');
      return;
    }

    setIsLoading(true);

    try {
      if (isSubscribed) {
        // Desinscrever
        const success = await unsubscribeFromNotifications();
        if (success) {
          setIsSubscribed(false);
          toast.success('Notificações desativadas com sucesso');
        } else {
          toast.error('Erro ao desativar notificações');
        }
      } else {
        // Inscrever
        const success = await requestNotificationPermission();
        if (success) {
          setIsSubscribed(true);
          toast.success('🎉 Notificações ativadas! Você receberá avisos de novos eventos.');
        } else {
          toast.error('Permissão negada ou cancelada');
        }
      }
    } catch (error: any) {
      console.error('Erro ao alternar notificações:', error);
      toast.error(error.message || 'Erro ao gerenciar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  // Não renderizar se OneSignal não estiver configurado
  if (!isOneSignalEnabled()) {
    return null;
  }

  return (
    <button
      onClick={handleToggleNotifications}
      disabled={isLoading}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
        transition-all duration-300 hover:scale-105
        ${isSubscribed 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50' 
          : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/50'
        }
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      `}
      title={isSubscribed ? 'Desativar notificações' : 'Ativar notificações'}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="hidden sm:inline">Carregando...</span>
        </>
      ) : isSubscribed ? (
        <>
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">Notificações Ativas</span>
        </>
      ) : (
        <>
          <BellOff className="w-4 h-4" />
          <span className="hidden sm:inline">Ativar Notificações</span>
        </>
      )}
      
      {/* Indicador de status */}
      {!isLoading && (
        <span className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white
          ${isSubscribed ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}
        `} />
      )}
    </button>
  );
}
