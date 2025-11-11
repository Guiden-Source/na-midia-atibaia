import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AddressManager } from '@/components/delivery/AddressManager';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Perfil
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Meus Endereços
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus endereços de entrega salvos
          </p>
        </div>

        {/* Componente de Gerenciamento */}
        <AddressManager userId={session.user.id} />
      </div>
    </div>
  );
}
