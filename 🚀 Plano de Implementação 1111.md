🚀 Plano de Implementação
Passo 1: Clone o repositório principal
bash
# Clonar template Shadcn Admin
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git admin-temp

cd admin-temp
npm install
npm run dev
Passo 2: Extrair componentes úteis
Do template para o Na Mídia:

text
admin-temp/
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx           → /components/admin/Sidebar.tsx
│   │   ├── header.tsx            → /components/admin/Header.tsx
│   │   └── user-nav.tsx          → /components/shared/UserNav.tsx
│   ├── dashboard/
│   │   ├── overview.tsx          → /components/admin/Overview.tsx
│   │   └── recent-sales.tsx      → /components/admin/RecentOrders.tsx
│   └── ui/
│       ├── data-table.tsx        → /components/ui/DataTable.tsx (para produtos)
│       ├── card.tsx              → /components/ui/Card.tsx
│       └── form.tsx              → /components/ui/Form.tsx
Passo 3: Criar estrutura de rotas no Na Mídia
text
app/
├── admin/
│   ├── layout.tsx                # Layout com sidebar admin
│   ├── page.tsx                  # Dashboard overview
│   ├── produtos/
│   │   ├── page.tsx              # Lista de produtos (DataTable)
│   │   ├── novo/page.tsx         # Adicionar produto
│   │   └── [id]/editar/page.tsx  # Editar produto
│   └── pedidos/
│       ├── page.tsx              # Lista de pedidos
│       └── [id]/page.tsx         # Detalhes do pedido
│
└── perfil/
    ├── layout.tsx                # Layout do usuário
    ├── page.tsx                  # Dashboard do usuário
    ├── pedidos/page.tsx          # Histórico de pedidos
    ├── enderecos/page.tsx        # Endereços salvos
    └── configuracoes/page.tsx    # Configurações
Passo 4: Adaptar layout admin
tsx
// app/admin/layout.tsx

import { Sidebar } from '@/components/admin/Sidebar'
import { Header } from '@/components/admin/Header'

export default async function AdminLayout({ children }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  // Verificar se é admin
  if (!user || user.user_metadata.role !== 'admin') {
    redirect('/')
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
Passo 5: Criar DataTable para produtos
tsx
// app/admin/produtos/page.tsx

import { DataTable } from '@/components/ui/DataTable'
import { columns } from './columns'

export default async function AdminProdutos() {
  const products = await getProducts()
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Link href="/admin/produtos/novo">
          <Button>+ Adicionar Produto</Button>
        </Link>
      </div>
      
      <DataTable columns={columns} data={products} />
    </div>
  )
}
tsx
// app/admin/produtos/columns.tsx

export const columns = [
  {
    accessorKey: "image_url",
    header: "Imagem",
    cell: ({ row }) => (
      <Image 
        src={row.getValue("image_url")} 
        width={50} 
        height={50}
        className="rounded"
      />
    )
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => `R$ ${row.getValue("price")}`
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_active") ? "success" : "secondary"}>
        {row.getValue("is_active") ? "Ativo" : "Inativo"}
      </Badge>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">⋮</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/admin/produtos/${row.original.id}/editar`}>
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleActive(row.original.id)}>
            {row.getValue("is_active") ? "Desativar" : "Ativar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]
🎨 Para o Painel do Usuário
Use design mais simples e focado:

tsx
// app/perfil/page.tsx

export default async function PerfilPage() {
  const user = await getCurrentUser()
  const stats = await getUserStats(user.id)
  
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_orders}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>No Carrinho</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.cart_items}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {stats.total_spent}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Últimos pedidos */}
      <RecentOrders userId={user.id} />
    </div>
  )
}
📋 Resumo: O que usar
Componente	Repositório	O que extrair
Admin Dashboard	Kiranism/next-shadcn-dashboard-starter	Sidebar, Header, DataTable, Forms
User Profile	Mesmo repositório	Cards, Avatar, Settings pages
UI Components	Shadcn UI docs	Todos os componentes base
Gráficos (opcional)	TailAdmin/free-nextjs-admin-dashboard	Chart components
Recomendação final: Clone o Kiranism/next-shadcn-dashboard-starter, extraia os componentes e adapte para o design do Na Mídia. É o mais moderno, mantido e compatível com sua stack!