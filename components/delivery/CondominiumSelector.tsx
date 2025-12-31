"use client";

import { CONDOMINIUMS, type Condominium } from '@/lib/delivery/simplified-checkout-types';

interface CondominiumSelectorProps {
    value: Condominium | '';
    onChange: (value: Condominium) => void;
    error?: string;
}

export function CondominiumSelector({ value, onChange, error }: CondominiumSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Condomínio <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
                {CONDOMINIUMS.map((condo) => (
                    <button
                        key={condo.id}
                        type="button"
                        onClick={() => onChange(condo.id)}
                        className={`
              relative rounded-xl px-4 py-3 text-center font-baloo2 font-semibold transition-all
              ${value === condo.id
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500'
                            }
            `}
                    >
                        {value === condo.id && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        {condo.displayName}
                    </button>
                ))}
            </div>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}
        </div>
    );
}
