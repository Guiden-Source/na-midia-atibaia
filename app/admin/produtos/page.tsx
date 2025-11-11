import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProductsManager } from '@/components/delivery/ProductsManager';

export const metadata = {
  title: 'Gerenciar Produtos - Admin',
  description: 'Gerencie os produtos do delivery',
};

export default async function AdminProductsPage() {
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

  if (!session) {
    redirect('/login?redirect=/admin/produtos');
  }

  // Verificar se é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/delivery');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Produtos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione, edite ou remova produtos do delivery
          </p>
        </div>

        <ProductsManager />
      </div>
    </div>
  );
}
