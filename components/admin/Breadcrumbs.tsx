'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // Mapa de rotas para labels amigáveis
  const routeLabels: Record<string, string> = {
    'admin': 'Dashboard',
    'produtos': 'Produtos',
    'pedidos': 'Pedidos',
    'criar': 'Criar Evento',
    'editar': 'Editar Evento',
    'analytics': 'Analytics',
    'delivery': 'Delivery',
    'promocoes': 'Promoções',
    'cupons': 'Cupons',
  };

  // Gerar breadcrumbs baseado no pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Sempre adiciona Home
    breadcrumbs.push({ label: 'Admin', href: '/admin' });

    // Processa cada segmento do path
    let currentPath = '';
    paths.forEach((segment, index) => {
      // Pula o primeiro segmento se for 'admin'
      if (segment === 'admin' && index === 0) return;

      currentPath += `/${segment}`;

      // Se for um ID (número ou UUID), mostra como "Item #ID"
      if (/^[0-9a-f-]{36}$/.test(segment) || /^\d+$/.test(segment)) {
        breadcrumbs.push({
          label: `#${segment.substring(0, 8)}...`,
          href: undefined // Último item, sem link
        });
      } else {
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({
          label,
          href: index === paths.length - 1 ? undefined : currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Não mostra breadcrumbs no dashboard principal
  if (pathname === '/admin') {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Home className="w-4 h-4 text-gray-400" />

      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}

          {crumb.href ? (
            <Link
              href={crumb.href}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Breadcrumbs customizados para casos específicos
interface CustomBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function CustomBreadcrumbs({ items }: CustomBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Home className="w-4 h-4 text-gray-400" />

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}

          {item.href ? (
            <Link
              href={item.href}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
