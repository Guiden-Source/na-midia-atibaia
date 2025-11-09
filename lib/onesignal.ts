// Client-side OneSignal helpers
// These functions run only in the browser

export function isOneSignalEnabled() {
  return !!process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
}

export async function initOneSignal() {
  if (typeof window === 'undefined') return false;
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  if (!appId) {
    console.warn('OneSignal não configurado - variável NEXT_PUBLIC_ONESIGNAL_APP_ID ausente');
    return false;
  }
  if ((window as any).OneSignalInitialized) return true;
  
  try {
    const { default: OneSignal } = await import('react-onesignal');
    await OneSignal.init({ 
      appId, 
      allowLocalhostAsSecureOrigin: true 
    });
    (window as any).OneSignalInitialized = true;
    console.log('✅ OneSignal inicializado');
    return true;
  } catch (e) {
    console.warn('[OneSignal] falha ao inicializar', e);
    return false;
  }
}

export async function isUserSubscribed(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) {
    throw new Error('Push notifications não suportadas neste navegador');
  }
  
  // Already granted
  if (Notification.permission === 'granted') return true;
  
  // Previously denied
  if (Notification.permission === 'denied') {
    throw new Error('Permissão negada anteriormente. Habilite nas configurações do navegador.');
  }
  
  try {
    const { default: OneSignal } = await import('react-onesignal');
    // Try slidedown prompt (best UX)
    try {
      // @ts-ignore
      await OneSignal.Slidedown?.promptPush?.();
    } catch {}
    // Fallback to native
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch (e) {
    console.warn('[OneSignal] erro permissão', e);
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
}

export async function unsubscribeFromNotifications(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const { default: OneSignal } = await import('react-onesignal');
    // @ts-ignore
    await OneSignal.setSubscription?.(false);
    return true;
  } catch (e) {
    console.error('Erro ao cancelar inscrição:', e);
    return false;
  }
}

export async function getPlayerId(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const { default: OneSignal } = await import('react-onesignal');
    // @ts-ignore
    const userId = await OneSignal.getUserId?.();
    return userId || null;
  } catch (e) {
    console.error('Erro ao obter Player ID:', e);
    return null;
  }
}

export async function setUserTags(tags: Record<string, any>): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const { default: OneSignal } = await import('react-onesignal');
    // @ts-ignore
    await OneSignal.sendTags?.(tags);
    return true;
  } catch (e) {
    console.error('Erro ao definir tags:', e);
    return false;
  }
}

// Enviar notificação (server-side via API)
export const sendNotification = async (data: {
  title: string;
  message: string;
  url?: string;
  imageUrl?: string;
  segment?: string[];
}): Promise<boolean> => {
  const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;
  const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  
  if (!REST_API_KEY || !APP_ID) {
    console.warn('OneSignal REST API Key ou APP ID não configurados');
    return false;
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: APP_ID,
        headings: { en: data.title },
        contents: { en: data.message },
        url: data.url,
        big_picture: data.imageUrl,
        chrome_web_image: data.imageUrl,
        firefox_icon: data.imageUrl,
        included_segments: data.segment || ['All'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao enviar notificação:', error);
      return false;
    }

    const result = await response.json();
    console.log('✅ Notificação enviada:', result);
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return false;
  }
}
