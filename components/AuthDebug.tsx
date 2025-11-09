'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      
      // Verificar sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Verificar usuário
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Verificar variáveis de ambiente
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setDebugInfo({
        hasSession: !!session,
        hasUser: !!user,
        userEmail: user?.email,
        userId: user?.id,
        userMetadata: user?.user_metadata,
        sessionError: sessionError?.message,
        userError: userError?.message,
        hasEnvUrl: hasUrl,
        hasEnvKey: hasKey,
        timestamp: new Date().toISOString()
      });
    };
    
    checkAuth();
    
    // Re-check a cada 2 segundos
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <details className="rounded-lg bg-black/90 text-white p-4 text-xs font-mono">
        <summary className="cursor-pointer font-bold mb-2">
          🔐 Auth Debug {debugInfo.hasUser ? '✅' : '❌'}
        </summary>
        <pre className="overflow-auto max-h-64 whitespace-pre-wrap">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
}
