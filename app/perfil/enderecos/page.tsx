import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AddressManager } from '@/components/delivery/AddressManager';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export const metadata = {
  title: 'Meus Endereços - Na Mídia',
  description: 'Gerencie seus endereços de entrega',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EnderecosPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/login?redirect=/perfil/enderecos');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-orange-400/10 to-pink-400/10 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 pt-24 md:pt-28 relative z-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary font-medium transition-colors mb-6 group"
          >
            <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="font-baloo2">Voltar ao perfil</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <MapPin size={32} />
            </div>
            <div>
              <h1 className="font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Meus Endereços
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie seus locais de entrega
              </p>
            </div>
          </div>
        </div>

        {/* Componente de Gerenciamento */}
        <LiquidGlass className="p-6 sm:p-8" intensity={0.2}>
          <AddressManager userId={session.user.id} />
        </LiquidGlass>
      </div>
    </div>
  );
}
