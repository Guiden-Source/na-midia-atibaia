'use client';

import { Edit, Trash2, Star } from 'lucide-react';

export type SavedAddress = {
    id: string;
    user_id: string;
    label: string;
    street: string;
    number: string;
    complement?: string;
    condominium: string;
    block?: string;
    apartment?: string;
    reference?: string;
    is_default: boolean;
    created_at: string;
};

interface AddressListProps {
    addresses: SavedAddress[];
    onEdit: (address: SavedAddress) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
}

export function AddressList({ addresses, onEdit, onDelete, onSetDefault }: AddressListProps) {
    if (addresses.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                    <div className="text-4xl">📍</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-baloo2">
                    Nenhum endereço salvo
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Cadastre seus endereços para agilizar a entrega dos seus pedidos.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
                <div
                    key={address.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-2 transition-all ${address.is_default
                        ? 'border-yellow-500'
                        : 'border-gray-200 dark:border-gray-700'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {address.label}
                                {address.is_default && (
                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                )}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {address.condominium}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(address)}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                title="Editar"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => onDelete(address.id)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Excluir"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Endereço */}
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <p>{address.street}, {address.number}</p>
                        {address.block && <p>Bloco {address.block}</p>}
                        {address.apartment && <p>Apto {address.apartment}</p>}
                        {address.complement && <p>{address.complement}</p>}
                        {address.reference && (
                            <p className="text-xs italic">Ref: {address.reference}</p>
                        )}
                    </div>

                    {/* Botão Padrão */}
                    {!address.is_default && (
                        <button
                            onClick={() => onSetDefault(address.id)}
                            className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Definir como padrão
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
