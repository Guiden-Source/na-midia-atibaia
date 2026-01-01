'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createCategory, updateCategory, type Category, type CategoryFormData } from '@/lib/delivery/categories';

interface CategoryFormProps {
    category?: Category | null;
    onClose: () => void;
    onSuccess: () => void;
}

// Popular emojis para categorias de delivery/mercado
const POPULAR_EMOJIS = [
    '🔥', '⭐', '🏠', '🍺', '🧹', '🍰', '🍕', '🍔', '🍟', '🌭',
    '🥗', '🍗', '🍖', '🥩', '🍞', '🥖', '🧀', '🥚', '🥛', '🍇',
    '🍌', '🍎', '🍊', '🍋', '🍉', '🍓', '🥝', '🍅', '🥒', '🥕',
    '🛒', '🏪', '🍱', '🥡', '☕', '🍷', '🍻', '🥤', '🧃', '🧊'
];

export function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');
    const [icon, setIcon] = useState(category?.icon || '🏠');
    const [displayOrder, setDisplayOrder] = useState(category?.display_order || 0);
    const [isActive, setIsActive] = useState(category?.is_active !== false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Nome é obrigatório');
            return;
        }

        setLoading(true);

        const data: CategoryFormData = {
            name: name.trim(),
            icon,
            display_order: displayOrder,
            is_active: isActive,
        };

        const result = category
            ? await updateCategory(category.id, data)
            : await createCategory(data);

        setLoading(false);

        if (result.success) {
            toast.success(category ? 'Categoria atualizada!' : 'Categoria criada!');
            onSuccess();
            onClose();
        } else {
            toast.error(result.error || 'Erro ao salvar categoria');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2">
                        {category ? 'Editar Categoria' : 'Nova Categoria'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Nome da Categoria *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Bebidas, Limpeza, Açougue..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Emoji Picker */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Emoji/Ícone
                        </label>
                        <div className="grid grid-cols-10 gap-2">
                            {POPULAR_EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setIcon(emoji)}
                                    className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${icon === emoji
                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Ou digite seu próprio emoji:
                            <input
                                type="text"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                maxLength={2}
                                className="ml-2 w-16 px-2 py-1 text-center rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                        </p>
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Ordem de Exibição
                        </label>
                        <input
                            type="number"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Menor número aparece primeiro. 0 = primeira categoria
                        </p>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Categoria {isActive ? 'ativa' : 'inativa'}
                        </span>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : category ? 'Atualizar' : 'Criar Categoria'}
                    </button>
                </div>
            </div>
        </div>
    );
}
