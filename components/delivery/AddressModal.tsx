"use client";

import { MapPin, Plus, Check } from 'lucide-react';
import { useState } from 'react';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (address: string) => void;
    currentAddress: string;
}

const MOCK_ADDRESSES = [
    { id: 1, label: 'Casa', address: 'Jeronimo de Camargo, 123', detail: 'Casa 2' },
    { id: 2, label: 'Trabalho', address: 'Av. Lucas Nogueira Garcez, 1500', detail: 'Sala 10' },
];

export function AddressModal({ isOpen, onClose, onSelect, currentAddress }: AddressModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl md:rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Onde você quer receber?</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        Fechar
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {MOCK_ADDRESSES.map((addr) => (
                        <button
                            key={addr.id}
                            onClick={() => {
                                onSelect(addr.address);
                                onClose();
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${currentAddress === addr.address
                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <div className={`p-2 rounded-full ${currentAddress === addr.address ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-gray-900 dark:text-white">{addr.label}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{addr.address}</p>
                                <p className="text-xs text-gray-400">{addr.detail}</p>
                            </div>
                            {currentAddress === addr.address && (
                                <Check className="h-5 w-5 text-orange-500" />
                            )}
                        </button>
                    ))}

                    <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 hover:text-orange-500 transition-colors text-gray-500">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                            <Plus className="h-5 w-5" />
                        </div>
                        <span className="font-medium">Adicionar novo endereço</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
