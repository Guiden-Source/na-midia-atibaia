"use client";

import { TOWERS, type Tower } from '@/lib/delivery/simplified-checkout-types';

interface TowerSelectorProps {
    value: Tower | '';
    onChange: (value: Tower) => void;
    error?: string;
}

export function TowerSelector({ value, onChange, error }: TowerSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Torre <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-4 gap-2">
                {TOWERS.map((tower) => (
                    <button
                        key={tower}
                        type="button"
                        onClick={() => onChange(tower)}
                        className={`
              relative rounded-xl px-4 py-3 text-center font-baloo2 font-bold text-lg transition-all
              ${value === tower
                                ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500'
                            }
            `}
                    >
                        {value === tower && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        {tower}
                    </button>
                ))}
            </div>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}
        </div>
    );
}
