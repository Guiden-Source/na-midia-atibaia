'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
import { Home, ShoppingCart, Package, Ticket, BarChart, Activity, LogOut, Menu, X, Layers, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Produtos',
    href: '/admin/produtos',
    icon: Package,
  },
  {
    title: 'Categorias',
    href: '/admin/categorias',
    icon: FolderTree,
  },
  {
    title: 'Pedidos',
    href: '/admin/pedidos',
    icon: ShoppingCart,
  },
  {
    title: 'Promoções',
    href: '/admin/promocoes',
    icon: Gift,
  },
  {
    title: 'Cupons',
    href: '/admin/cupons',
    icon: Ticket,
  },
  {
    title: 'Catálogo',
    href: '/admin/catalogo',
    icon: ImageIcon,
  },
  {
    title: 'Criar Evento',
    href: '/admin/criar',
    icon: Calendar,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col relative z-20 p-4`}>
      <LiquidGlass className="h-full flex flex-col" intensity={0.3}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Image
                  src="/logotiponamidiavetorizado.svg"
                  alt="Na Mídia"
                  width={120}
                  height={40}
                  className="h-8 w-auto dark:brightness-0 dark:invert"
                />
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                title={collapsed ? item.title : undefined}
              >
                <Icon size={20} />
                {!collapsed && (
                  <span>{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer with Home Link */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5 transition-all font-medium"
            title={collapsed ? 'Voltar ao Site' : undefined}
          >
            <Home size={20} />
            {!collapsed && <span>Voltar ao Site</span>}
          </Link>
        </div>
      </LiquidGlass>
    </div>
  );
}
