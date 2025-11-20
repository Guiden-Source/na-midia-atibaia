"use client";

import type { Promotion } from '@/lib/types';
import { Calendar, Gift, MapPin, Instagram, Phone, Percent, DollarSign, Award } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { claimPromotionAction } from '@/app/actions';

interface PromotionCardProps {
    promotion: Promotion;
    onClaim?: () => void;
}

export function PromotionCard({ promotion, onClaim }: PromotionCardProps) {
    const [claiming, setClaiming] = useState(false);

    const handleClaim = async () => {
        setClaiming(true);
        try {
            const result = await claimPromotionAction(promotion.id);

            if (result.success) {
                toast.success(result.data.message, {
                    duration: 5000,
                    icon: '🎉',
                });
                onClaim?.();
            } else {
                toast.error(result.error || 'Erro ao resgatar promoção');
            }
        } catch (error) {
            toast.error('Erro ao resgatar promoção');
        } finally {
            setClaiming(false);
        }
    };

    const getDiscountBadge = () => {
        if (promotion.discount_type === 'percentage' && promotion.discount_value) {
            return (
                <div className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    <Percent className="h-3.5 w-3.5" />
                    {promotion.discount_value}% OFF
                </div>
            );
        }
        if (promotion.discount_type === 'fixed' && promotion.discount_value) {
            return (
                <div className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    <DollarSign className="h-3.5 w-3.5" />
                    R$ {promotion.discount_value} OFF
                </div>
            );
        }
        if (promotion.discount_type === 'freebie') {
            return (
                <div className="flex items-center gap-1.5 rounded-full bg-purple-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    <Gift className="h-3.5 w-3.5" />
                    GRÁTIS
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                <Award className="h-3.5 w-3.5" />
                ESPECIAL
            </div>
        );
    };

    const getCategoryColor = () => {
        switch (promotion.category) {
            case 'food':
                return 'from-red-500 to-orange-500';
            case 'drinks':
                return 'from-amber-500 to-yellow-500';
            case 'delivery':
                return 'from-blue-500 to-cyan-500';
            case 'events':
                return 'from-purple-500 to-pink-500';
            default:
                return 'from-orange-500 to-pink-500';
        }
    };

    const isExpiringSoon = () => {
        if (!promotion.valid_until) return false;
        const daysToExpire = Math.floor(
            (new Date(promotion.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return daysToExpire <= 3 && daysToExpire >= 0;
    };

    const isLimitedStock = () => {
        if (!promotion.max_uses) return false;
        const remaining = promotion.max_uses - promotion.current_uses;
        const percentRemaining = (remaining / promotion.max_uses) * 100;
        return percentRemaining <= 20;
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border bg-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor()} opacity-5 transition-opacity group-hover:opacity-10`} />

            {/* Content */}
            <div className="relative p-5 sm:p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="mb-1 font-baloo2 text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                            {promotion.title}
                        </h3>
                        {promotion.venue_name && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{promotion.venue_name}</span>
                            </p>
                        )}
                    </div>
                    {getDiscountBadge()}
                </div>

                {/* Description */}
                {promotion.description && (
                    <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {promotion.description}
                    </p>
                )}

                {/* Alerts */}
                <div className="mb-4 flex flex-col gap-2">
                    {isExpiringSoon() && (
                        <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                            <Calendar className="h-3.5 w-3.5" />
                            Expira em breve!
                        </div>
                    )}
                    {isLimitedStock() && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                            <Award className="h-3.5 w-3.5" />
                            Últimas unidades!
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    {promotion.valid_until && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                                Até {new Date(promotion.valid_until).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    )}
                    {promotion.venue_instagram && (
                        <a
                            href={`https://instagram.com/${promotion.venue_instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-pink-600 transition-colors"
                        >
                            <Instagram className="h-3.5 w-3.5" />
                            <span>{promotion.venue_instagram}</span>
                        </a>
                    )}
                    {promotion.venue_phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{promotion.venue_phone}</span>
                        </div>
                    )}
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className={`
            w-full rounded-xl px-6 py-3 font-baloo2 text-base font-bold 
            text-white shadow-lg transition-all
            ${claiming
                            ? 'bg-gray-400 cursor-not-allowed'
                            : `bg-gradient-to-r ${getCategoryColor()} hover:scale-105 hover:shadow-xl active:scale-95`
                        }
          `}
                >
                    {claiming ? 'Resgatando...' : 'Resgatar Cupom'}
                </button>

                {/* Terms hint */}
                {promotion.terms && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        * Ver termos e condições
                    </p>
                )}
            </div>
        </div>
    );
}
