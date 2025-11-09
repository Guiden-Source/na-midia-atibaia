"use client";
import { useState, useEffect } from 'react';
import { buttonClasses } from './Button';
import { requestNotificationPermission } from '@/lib/onesignal';

export function SubscribeNotificationsButton() {
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') setStatus('granted');
      else if (Notification.permission === 'denied') setStatus('denied');
    }
  }, []);

  async function handleClick() {
    const granted = await requestNotificationPermission();
    setStatus(granted ? 'granted' : 'denied');
  }

  if (status === 'granted') {
    return <span className="text-xs text-green-200 font-poppins">Notificações ativadas ✔</span>;
  }

  return (
    <button onClick={handleClick} className={buttonClasses('secondary')}>
      {status === 'denied' ? 'Permissão negada' : 'Receber avisos de eventos'}
    </button>
  );
}
