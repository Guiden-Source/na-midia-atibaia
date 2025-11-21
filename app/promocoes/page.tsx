"use client";

import { fetchPromotionsAction } from '@/app/actions';
import type { Promotion } from '@/lib/types';
import { PromotionsGrid } from '@/components/PromotionsGrid';
import { useEffect, useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PromocoesPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPromotions = async () => {
        try {
            const result = await fetchPromotionsAction();
            if (result.success) {
                setPromotions(result.data);
            }
        } catch (error) {
            console.error('Error loading promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPromotions();
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />

                <div className="container relative mx-auto px-5 sm:px-6 lg:px-8">
                    <BlurFade delay={0}>
                        <div className="text-center">
                            {/* Icon */}
                            <div className="mb-6 flex justify-center">
                                <div className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-xl">
                                    <Gift className="h-12 w-12 text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="mb-4 font-baloo2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                                Promoções & Cupons
                            </h1>

                            {/* Subtitle */}
                            <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-700 dark:text-gray-200 lg:text-xl">
                                Aproveite as melhores ofertas e descontos de Atibaia
                            </p>

                            {/* Stats */}
                            {!loading && (
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                                    <div className="flex items-center gap-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 shadow-lg">
                                        <Sparkles className="h-5 w-5 text-purple-500" />
                                        <span className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">
                                            {promotions.length} {promotions.length === 1 ? 'Promoção' : 'Promoções'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </BlurFade>
                </div>
            </section>

            {/* Promotions Grid */}
            <section className="relative pb-16 sm:pb-20 lg:pb-24">
                <div className="container mx-auto px-5 sm:px-6 lg:px-8">
                    <BlurFade delay={0.1}>
                        {loading ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-96 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                                    />
                                ))}
                            </div>
                        ) : (
                            <PromotionsGrid
                                promotions={promotions}
                                onPromotionClaim={loadPromotions}
                            />
                        )}
                    </BlurFade>

                    {/* Back to Home */}
                    <BlurFade delay={0.2}>
                        <div className="mt-12 flex justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-4 font-baloo2 text-base sm:text-lg font-bold text-gray-900 dark:text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                            >
                                ← Voltar para Home
                            </Link>
                        </div>
                    </BlurFade>
                </div>
            </section>
        </main>
    );
}
