import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

const ADMIN_EMAILS = [
  'guidjvb@gmail.com',
  'admin@namidia.com.br',
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Verificar autenticação
  if (!session?.user) {
    redirect('/login?redirect=/admin');
  }

  // Verificar se é admin
  const isAdmin = ADMIN_EMAILS.includes(session.user.email || '');
  
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
