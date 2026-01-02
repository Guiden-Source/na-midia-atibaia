'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, ShoppingCart, MapPin, Ticket, Calendar, Users, ChevronRight } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface ProfileStats {
    cupons: number;
    pedidos: number;
    carrinho: number;
    enderecos: number;
}

interface ProfileQuickLinksProps {
    stats: ProfileStats;
}

export function ProfileQuickLinks({ stats }: ProfileQuickLinksProps) {
    const quickLinks = [
        { icon: ShoppingBag, label: "Novo Pedido", href: "/delivery", color: "orange", desc: "Faça um novo pedido" },
        { icon: Package, label: "Meus Pedidos", href: "/perfil/pedidos", color: "blue", desc: `${stats.pedidos} pedidos` },
        { icon: Ticket, label: "Cupons", href: "/perfil/cupons", color: "purple", desc: `${stats.cupons} disponíveis` },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
                <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link href={link.href}>
                        <LiquidGlass className={`p-5 group hover:border-${link.color}-500/30 transition-colors h-full`}>
                            <div className="flex items-start gap-4">
                                <div className={`h-12 w-12 rounded-xl bg-${link.color}-50 dark:bg-${link.color}-900/20 flex items-center justify-center text-${link.color}-600 dark:text-${link.color}-400 group-hover:scale-110 transition-transform shrink-0`}>
                                    <link.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-baloo2 font-bold text-gray-900 dark:text-white group-hover:text-${link.color}-600 transition-colors mb-1`}>
                                        {link.label}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.desc}</p>
                                </div>
                                <ChevronRight className={`h-5 w-5 text-gray-400 group-hover:text-${link.color}-500 group-hover:translate-x-1 transition-all shrink-0`} />
                            </div>
                        </LiquidGlass>
                    </Link>
                </motion.div>
            ))}

            {/* Amigos - Coming Soon */}

        </div>
    );
}
