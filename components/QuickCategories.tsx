"use client";

import { PartyPopper, Beer, UtensilsCrossed, Gift, Bike, Truck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
    {
        name: 'Eventos',
        icon: PartyPopper,
        href: '/#eventos',
        gradient: 'from-orange-500 to-pink-500',
        bgGradient: 'from-orange-50 to-pink-50',
        description: 'Shows, baladas e festas'
    },
    {
        name: 'Bares',
        icon: Beer,
        href: '/#eventos', // Filtrado por tipo de evento
        gradient: 'from-amber-500 to-orange-500',
        bgGradient: 'from-amber-50 to-orange-50',
        description: 'Melhores chopps e drinks'
    },
    {
        name: 'Restaurantes',
        icon: UtensilsCrossed,
        href: '/#eventos', // Filtrado por tipo de evento
        gradient: 'from-red-500 to-pink-500',
        bgGradient: 'from-red-50 to-pink-50',
        description: 'Gastronomia local'
    },
    {
        name: 'Cupons',
        icon: Gift,
        href: '/promocoes', // Atualizado para a página de promoções
        gradient: 'from-purple-500 to-pink-500',
        bgGradient: 'from-purple-50 to-pink-50',
        description: 'Descontos e promoções'
    },
    {
        name: 'Atividades',
        icon: Bike,
        href: '/#eventos', // Filtrado por tipo de evento
        gradient: 'from-green-500 to-teal-500',
        bgGradient: 'from-green-50 to-teal-50',
        description: 'O que fazer em Atibaia'
    },
    {
        name: 'Delivery',
        icon: Truck,
        href: '/delivery',
        gradient: 'from-blue-500 to-cyan-500',
        bgGradient: 'from-blue-50 to-cyan-50',
        description: 'Peça e receba em casa'
    },
];

export function QuickCategories() {
    return (
        <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-white dark:bg-gray-950">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

            <div className="container relative mx-auto px-5 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 sm:mb-10 text-center">
                    <h2 className="mb-2 font-baloo2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
                        Explore Atibaia
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
                        Escolha uma categoria e descubra tudo que a cidade tem a oferecer
                    </p>
                </div>

                {/* Grid de categorias */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <Link
                                    href={category.href}
                                    className="group block"
                                    aria-label={`Ver ${category.name}`}
                                >
                                    <div
                                        className={`
                      relative overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-7
                      bg-gradient-to-br ${category.bgGradient}
                      dark:from-gray-800 dark:to-gray-900
                      border border-gray-200 dark:border-gray-700
                      transition-all duration-300
                      hover:scale-105 hover:shadow-xl hover:shadow-orange-100
                      dark:hover:shadow-orange-900/20
                      active:scale-95
                    `}
                                    >
                                        {/* Gradient overlay on hover */}
                                        <div
                                            className={`
                        absolute inset-0 opacity-0 group-hover:opacity-10
                        bg-gradient-to-br ${category.gradient}
                        transition-opacity duration-300
                      `}
                                        />

                                        {/* Content */}
                                        <div className="relative flex flex-col items-center text-center gap-3">
                                            {/* Icon */}
                                            <div
                                                className={`
                          flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16
                          items-center justify-center rounded-2xl
                          bg-gradient-to-br ${category.gradient}
                          shadow-lg
                          transition-transform duration-300
                          group-hover:scale-110 group-hover:rotate-3
                        `}
                                            >
                                                <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                                            </div>

                                            {/* Name */}
                                            <h3 className="font-baloo2 text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                                                {category.name}
                                            </h3>

                                            {/* Description - hidden on mobile */}
                                            <p className="hidden sm:block text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
