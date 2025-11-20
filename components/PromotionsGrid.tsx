"use client";

import type { Promotion } from '@/lib/types';
import { PromotionCard } from './PromotionCard';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

interface PromotionsGridProps {
    promotions: Promotion[];
    onPromotionClaim?: () => void;
}

export function PromotionsGrid({ promotions, onPromotionClaim }: PromotionsGridProps) {
    if (promotions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 sm:py-28 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <Gift className="mb-4 h-16 w-16 text-gray-400" />
                <h3 className="font-baloo2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Nenhuma promoção disponível no momento
                </h3>
                <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    Fique de olho, sempre tem novidades aparecendo 👀
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {promotions.map((promotion, index) => (
                <motion.div
                    key={promotion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                    <PromotionCard promotion={promotion} onClaim={onPromotionClaim} />
                </motion.div>
            ))}
        </div>
    );
}
