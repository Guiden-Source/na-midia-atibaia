"use client";

import { useState } from 'react';
import { Ticket, Check, X, Loader2 } from 'lucide-react';

interface CouponInputProps {
    value: string;
    onChange: (value: string) => void;
    onValidate: (code: string) => Promise<{ valid: boolean; discount: number; error?: string }>;
    discountApplied: number; // Percentual de desconto aplicado
    isValidating?: boolean;
}

export function CouponInput({ value, onChange, onValidate, discountApplied, isValidating = false }: CouponInputProps) {
    const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleValidate = async () => {
        if (!value.trim()) return;

        setValidationState('validating');
        setErrorMessage('');

        try {
            const result = await onValidate(value.trim().toUpperCase());

            if (result.valid) {
                setValidationState('valid');
            } else {
                setValidationState('invalid');
                setErrorMessage(result.error || 'Cupom inválido');
            }
        } catch (error) {
            setValidationState('invalid');
            setErrorMessage('Erro ao validar cupom');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toUpperCase();
        onChange(newValue);
        setValidationState('idle');
        setErrorMessage('');
    };

    return (
        <div className="space-y-2">
            <label htmlFor="coupon" className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <Ticket className="w-4 h-4" />
                Cupom de Desconto (opcional)
            </label>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        id="coupon"
                        value={value}
                        onChange={handleChange}
                        placeholder="Ex: VOLTA10-ABC123"
                        maxLength={20}
                        className={`
              w-full px-4 py-3 pr-10 rounded-xl font-mono text-sm
              bg-white dark:bg-gray-800
              border-2 transition-all
              ${validationState === 'valid'
                                ? 'border-green-500'
                                : validationState === 'invalid'
                                    ? 'border-red-500'
                                    : 'border-gray-200 dark:border-gray-700 focus:border-orange-500'
                            }
              text-gray-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-orange-500/20
            `}
                    />

                    {/* Status icons */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {validationState === 'validating' && (
                            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                        )}
                        {validationState === 'valid' && (
                            <Check className="w-5 h-5 text-green-500" />
                        )}
                        {validationState === 'invalid' && (
                            <X className="w-5 h-5 text-red-500" />
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleValidate}
                    disabled={!value.trim() || validationState === 'validating'}
                    className="
            px-6 py-3 rounded-xl font-baloo2 font-semibold
            bg-orange-500 text-white
            hover:bg-orange-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
          "
                >
                    Aplicar
                </button>
            </div>

            {/* Validation messages */}
            {validationState === 'valid' && discountApplied > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300 font-semibold">
                        Cupom aplicado! {discountApplied}% de desconto
                    </p>
                </div>
            )}

            {validationState === 'invalid' && errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">
                Digite o código do cupom recebido por email
            </p>
        </div>
    );
}
