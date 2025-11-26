'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export type AddressFormData = {
    label: string;
    street: string;
    number: string;
    complement: string;
    condominium: string;
    block: string;
    apartment: string;
    reference: string;
    is_default: boolean;
};

const CONDOMINIUMS = [
    'Jeronimo de Camargo 1',
    'Jeronimo de Camargo 2',
];

interface AddressFormProps {
    initialData?: AddressFormData;
    onSubmit: (data: AddressFormData) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

export function AddressForm({ initialData, onSubmit, onCancel, isEditing = false }: AddressFormProps) {
    const [formData, setFormData] = useState<AddressFormData>({
        label: '',
        street: '',
        number: '',
        complement: '',
        condominium: '',
        block: '',
        apartment: '',
        reference: '',
        is_default: false,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {isEditing ? 'Editar Endereço' : 'Novo Endereço'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Label */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome do Endereço *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="Ex: Casa, Trabalho, Apartamento..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Condomínio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Condomínio *
                    </label>
                    <select
                        required
                        value={formData.condominium}
                        onChange={(e) => setFormData({ ...formData, condominium: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecione...</option>
                        {CONDOMINIUMS.map((cond) => (
                            <option key={cond} value={cond}>
                                {cond}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rua */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rua *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Número */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Número *
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            required
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Bloco */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bloco
                        </label>
                        <input
                            type="text"
                            autoCapitalize="characters"
                            value={formData.block}
                            onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Apartamento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Apartamento
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formData.apartment}
                            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Complemento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Complemento
                    </label>
                    <input
                        type="text"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        placeholder="Ex: Próximo ao portão principal"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Referência */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ponto de Referência
                    </label>
                    <input
                        type="text"
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        placeholder="Ex: Casa azul, portão branco"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Checkbox padrão */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_default}
                            onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            Definir como endereço padrão
                        </span>
                    </label>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Check size={20} />
                        <span>{isEditing ? 'Atualizar' : 'Salvar'} Endereço</span>
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        <X size={20} />
                        <span>Cancelar</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
