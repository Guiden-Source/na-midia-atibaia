import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {description}
      </p>

      {action && (
        <Link
          href={action.href}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// Empty states específicos
export function EmptyProducts() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <EmptyState
        icon={require('lucide-react').Package}
        title="Nenhum produto cadastrado"
        description="Comece adicionando seu primeiro produto para delivery. Os clientes poderão visualizar e fazer pedidos através do app."
        action={{
          label: "Adicionar Primeiro Produto",
          href: "/admin/produtos"
        }}
      />
    </div>
  );
}

export function EmptyOrders() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <EmptyState
        icon={require('lucide-react').ShoppingCart}
        title="Nenhum pedido ainda"
        description="Quando os clientes fizerem pedidos, eles aparecerão aqui. Divulgue sua loja para começar a receber pedidos!"
      />
    </div>
  );
}

export function EmptyEvents() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <EmptyState
        icon={require('lucide-react').Calendar}
        title="Nenhum evento criado"
        description="Crie seu primeiro evento para engajar a comunidade. Eventos são ótimas formas de atrair público e gerar cupons."
        action={{
          label: "Criar Primeiro Evento",
          href: "/admin/criar"
        }}
      />
    </div>
  );
}

export function EmptyAnalytics() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <EmptyState
        icon={require('lucide-react').BarChart3}
        title="Sem dados suficientes"
        description="Continue criando eventos e gerando cupons. Em breve você terá analytics e insights interessantes!"
      />
    </div>
  );
}

// Empty state para busca sem resultados
export function NoSearchResults({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🔍</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Nenhum resultado encontrado
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Não encontramos resultados para "<strong>{query}</strong>"
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
        Tente usar outros termos de busca ou filtros diferentes
      </p>
    </div>
  );
}

// Empty state para filtros sem resultados
export function NoFilterResults() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🎯</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Nenhum item corresponde aos filtros
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Tente ajustar ou limpar os filtros para ver mais resultados
      </p>
    </div>
  );
}
