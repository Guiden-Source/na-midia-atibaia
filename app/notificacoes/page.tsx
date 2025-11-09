'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, BellOff, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  initOneSignal,
  isUserSubscribed,
  requestNotificationPermission,
  unsubscribeFromNotifications,
  getPlayerId,
  isOneSignalEnabled,
} from '@/lib/onesignal';

export default function NotificationsPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const init = async () => {
      if (!isOneSignalEnabled()) {
        setIsLoading(false);
        return;
      }

      await initOneSignal();
      const subscribed = await isUserSubscribed();
      setIsSubscribed(subscribed);
      
      if (subscribed) {
        const id = await getPlayerId();
        setPlayerId(id);
      }

      if ('Notification' in window) {
        setPermission(Notification.permission);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const success = await requestNotificationPermission();
      if (success) {
        setIsSubscribed(true);
        setPermission('granted');
        const id = await getPlayerId();
        setPlayerId(id);
        toast.success('🎉 Notificações ativadas com sucesso!');
      } else {
        toast.error('Permissão negada ou cancelada');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao ativar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromNotifications();
      if (success) {
        setIsSubscribed(false);
        setPlayerId(null);
        toast.success('Notificações desativadas');
      } else {
        toast.error('Erro ao desativar notificações');
      }
    } catch (error) {
      toast.error('Erro ao desativar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOneSignalEnabled()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link 
            href="/perfil"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Perfil
          </Link>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <BellOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Notificações não disponíveis
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              O sistema de notificações não está configurado no momento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link 
          href="/perfil"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Perfil
        </Link>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-8">
          Gerenciar Notificações
        </h1>

        {/* Status Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {isSubscribed ? (
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Bell className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700">
                  <BellOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isSubscribed ? 'Notificações Ativas' : 'Notificações Desativadas'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isSubscribed 
                    ? 'Você receberá avisos sobre novos eventos' 
                    : 'Ative para receber avisos de eventos'}
                </p>
              </div>
            </div>
            
            {!isLoading && (
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                isSubscribed 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {isSubscribed ? 'ATIVO' : 'INATIVO'}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <button
              onClick={isSubscribed ? handleDisableNotifications : handleEnableNotifications}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSubscribed
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg'
              }`}
            >
              {isSubscribed ? (
                <>
                  <BellOff className="w-5 h-5 inline mr-2" />
                  Desativar Notificações
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5 inline mr-2" />
                  Ativar Notificações
                </>
              )}
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Você receberá avisos sobre:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-orange-600 mt-1">•</span>
                <span>Novos eventos publicados</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-orange-600 mt-1">•</span>
                <span>Eventos próximos que confirmou presença</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-orange-600 mt-1">•</span>
                <span>Atualizações importantes da plataforma</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              NÃO enviaremos:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-gray-400 mt-1">•</span>
                <span>Spam ou propaganda</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-gray-400 mt-1">•</span>
                <span>Mais de 2 notificações por dia</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-gray-400 mt-1">•</span>
                <span>Conteúdo não relacionado a eventos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Info (Debug) */}
        {playerId && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-sm">
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              <strong>Status do navegador:</strong> {permission}
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-mono text-xs">
              <strong>Player ID:</strong> {playerId}
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
            💡 Dica: Permissões Negadas?
          </h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
            Se você negou acidentalmente as permissões, precisará habilitá-las manualmente nas configurações do navegador:
          </p>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li>• <strong>Chrome/Edge:</strong> Clique no cadeado ao lado da URL → Permissões → Notificações → Permitir</li>
            <li>• <strong>Firefox:</strong> Clique no cadeado → Configurações do site → Notificações → Permitir</li>
            <li>• <strong>Safari:</strong> Safari → Preferências → Sites → Notificações → Permitir</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
