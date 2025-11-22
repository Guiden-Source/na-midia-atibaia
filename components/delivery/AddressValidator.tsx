"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, CheckCircle, Building } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import confetti from 'canvas-confetti';

interface AddressValidatorProps {
    onValidated: (address: string) => void;
}

export function AddressValidator({ onValidated }: AddressValidatorProps) {
    const [step, setStep] = useState<'input' | 'validating' | 'success'>('input');
    const [block, setBlock] = useState('');
    const [apartment, setApartment] = useState('');

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!block || !apartment) return;

        setStep('validating');

        // Simula validação
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStep('success');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            onValidated(`Residencial Jerônimo de Camargo - Bloco ${block}, Apto ${apartment}`);
        }, 1500);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {step === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <LiquidGlass className="p-8">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Building className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h2 className="text-2xl font-baloo2 font-bold text-gray-900 dark:text-white mb-2">
                                    Verificar Disponibilidade
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Entrega grátis exclusiva para moradores do Jerônimo de Camargo
                                </p>
                            </div>

                            <form onSubmit={handleValidate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        Qual seu Bloco?
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={block}
                                        onChange={(e) => setBlock(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="Ex: 05"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                        Qual seu Apartamento?
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={apartment}
                                        onChange={(e) => setApartment(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="Ex: 42"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    Verificar Endereço
                                    <ArrowRight size={20} />
                                </button>
                            </form>
                        </LiquidGlass>
                    </motion.div>
                )}

                {step === 'validating' && (
                    <motion.div
                        key="validating"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-12"
                    >
                        <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Verificando disponibilidade...
                        </h3>
                        <p className="text-gray-500">
                            Consultando nossa área de entrega rápida
                        </p>
                    </motion.div>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-3xl font-baloo2 font-bold text-gray-900 dark:text-white mb-4">
                            Tudo Certo! 🎉
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Você tem acesso ao <strong>Frete Grátis</strong> e entrega em <strong>30 minutos</strong>!
                        </p>
                        <p className="text-sm text-gray-400">
                            Redirecionando para o cardápio...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
