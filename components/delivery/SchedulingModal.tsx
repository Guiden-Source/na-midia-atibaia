"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, X, Check } from 'lucide-react';
import { useCart } from '@/lib/delivery/CartContext';
import { LiquidGlass } from '@/components/ui/liquid-glass';

interface SchedulingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SchedulingModal({ isOpen, onClose }: SchedulingModalProps) {
    const { scheduledTime, setScheduledTime } = useCart();
    const [mode, setMode] = useState<'now' | 'schedule'>(scheduledTime ? 'schedule' : 'now');
    const [selectedTime, setSelectedTime] = useState(scheduledTime || '19:00');

    const timeSlots = [
        '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
    ];

    const handleConfirm = () => {
        if (mode === 'now') {
            setScheduledTime(null);
        } else {
            setScheduledTime(selectedTime);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md"
            >
                <LiquidGlass className="p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2 mb-6 flex items-center gap-2">
                        <Clock className="text-orange-500" />
                        Quando deseja receber?
                    </h2>

                    <div className="space-y-4 mb-8">
                        {/* Option: Now */}
                        <button
                            onClick={() => setMode('now')}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${mode === 'now'
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'now' ? 'border-orange-500' : 'border-gray-300'
                                    }`}>
                                    {mode === 'now' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white">Agora</p>
                                    <p className="text-sm text-gray-500">30-45 min</p>
                                </div>
                            </div>
                        </button>

                        {/* Option: Schedule */}
                        <button
                            onClick={() => setMode('schedule')}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex flex-col gap-4 ${mode === 'schedule'
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-200'
                                }`}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'schedule' ? 'border-orange-500' : 'border-gray-300'
                                    }`}>
                                    {mode === 'schedule' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 dark:text-white">Agendar para receber mais tarde</p>
                                    <p className="text-sm text-gray-500">Escolha um horário</p>
                                </div>
                            </div>

                            {mode === 'schedule' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="w-full grid grid-cols-3 gap-2 pl-8"
                                >
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTime(time);
                                            }}
                                            className={`py-2 px-1 rounded-lg text-sm font-bold transition-colors ${selectedTime === time
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={handleConfirm}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        Confirmar
                        <Check size={20} />
                    </button>
                </LiquidGlass>
            </motion.div>
        </div>
    );
}
