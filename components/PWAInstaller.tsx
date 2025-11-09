'use client';

import { useEffect, useState } from 'react';
import { X, Download, Share } from 'lucide-react';

export function PWAInstaller() {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              console.log('🔄 Service Worker update found');
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('🆕 New Service Worker available');
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });
      });
    }

    // Detectar iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = ('standalone' in (window.navigator as any)) && ((window.navigator as any).standalone);
    
    // Mostrar prompt para iOS se não estiver instalado
    if (isIOS && !isStandalone) {
      const hasSeenPrompt = localStorage.getItem('pwa-ios-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowIOSPrompt(true);
        }, 3000); // Espera 3s antes de mostrar
      }
    }

    // Handle install prompt para Android/Desktop
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const hasSeenPrompt = localStorage.getItem('pwa-android-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowAndroidPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      setDeferredPrompt(null);
      setShowAndroidPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleIOSClose = () => {
    setShowIOSPrompt(false);
    localStorage.setItem('pwa-ios-prompt-seen', 'true');
  };

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Install prompt outcome: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowAndroidPrompt(false);
    localStorage.setItem('pwa-android-prompt-seen', 'true');
  };

  const handleAndroidClose = () => {
    setShowAndroidPrompt(false);
    localStorage.setItem('pwa-android-prompt-seen', 'true');
  };

  // Render iOS prompt
  if (showIOSPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-2xl animate-in slide-in-from-bottom">
        <div className="container mx-auto max-w-2xl">
          <button
            onClick={handleIOSClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4 pr-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Instalar Na Mídia</h3>
              <p className="text-sm text-white/90 mb-3">
                Adicione o app à tela inicial para acesso rápido e notificações de eventos!
              </p>
              
              <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur rounded-lg p-3">
                <span>1. Toque no botão</span>
                <Share className="w-5 h-5 mx-1" />
                <span>2. Role e toque em "Adicionar à Tela Inicial"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Android/Desktop prompt
  if (showAndroidPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-2xl animate-in slide-in-from-bottom">
        <div className="container mx-auto max-w-2xl">
          <button
            onClick={handleAndroidClose}
            className="absolute top-2 right-2 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4 pr-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Instalar Na Mídia</h3>
              <p className="text-sm text-white/90 mb-3">
                Instale nosso app para acesso rápido e receber notificações de novos eventos!
              </p>
              
              <button
                onClick={handleAndroidInstall}
                className="bg-white text-orange-600 font-bold px-6 py-2 rounded-full hover:bg-white/90 transition-colors"
              >
                Instalar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
