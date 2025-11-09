'use client';

import { useEffect } from 'react';

export function PWAInstaller() {
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
                    // Optionally show update notification
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

    // Handle install prompt
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent default browser install prompt
      e.preventDefault();
      deferredPrompt = e;
      console.log('💾 Install prompt available');
      
      // Show custom install button/banner if needed
      // You can dispatch a custom event here to show UI
      window.dispatchEvent(new CustomEvent('pwaInstallAvailable', { detail: deferredPrompt }));
    });

    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      deferredPrompt = null;
    });
  }, []);

  return null; // This component doesn't render anything
}

// Hook for showing install prompt
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handlePrompt = (e: any) => {
      setInstallPrompt(e.detail);
    };

    window.addEventListener('pwaInstallAvailable', handlePrompt);

    return () => {
      window.removeEventListener('pwaInstallAvailable', handlePrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) {
      console.log('No install prompt available');
      return false;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    console.log(`Install prompt outcome: ${outcome}`);
    setInstallPrompt(null);
    
    return outcome === 'accepted';
  };

  return { installPrompt, promptInstall };
}

function useState<T>(initialValue: T): [T, (value: T) => void] {
  const { useState: reactUseState } = require('react');
  return reactUseState(initialValue);
}
