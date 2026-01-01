'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Power, PowerOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { listCategories, deleteCategory, toggleCategoryStatus, type Category } from '@/lib/delivery/categories';
import { CategoryForm } from './CategoryForm';

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        const result = await listCategories();
        if (result.success && result.categories) {
            setCategories(result.categories);
        } else {
            toast.error('Erro ao carregar categorias');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Deletar categoria "${name}"?\n\nEsta ação não pode ser desfeita.`)) {
            return;
        }

        const result = await deleteCategory(id);
        if (result.success) {
            toast.success('Categoria deletada!');
            loadCategories();
        } else {
            toast.error(result.error || 'Erro ao deletar categoria');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const result = await toggleCategoryStatus(id, !currentStatus);
        if (result.success) {
            toast.success(currentStatus ? 'Categoria desativada' : 'Categoria ativada');
            loadCategories();
        } else {
            toast.error('Erro ao atualizar status');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Categorias ({categories.length})
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Organize seu cardápio por categorias personalizadas
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
                >
                    <Plus size={18} />
                    Nova Categoria
                </button>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Nenhuma categoria cadastrada
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                        Criar Primeira Categoria
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${category.is_active
                                    ? 'border-green-200 dark:border-green-800'
                                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                                } hover:shadow-lg transition-all`}
                        >
                            {/* Category Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{category.icon || '📦'}</span>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Ordem: {category.display_order}
                                        </p>
                                    </div>
                                </div>
                                {category.is_active ? (
                                    <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                        ATIVA
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 text-xs font-bold">
                                        INATIVA
                                    </span>
                                )}
                            </div>

                            {/* Category Info */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                <p>Slug: {category.slug}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                                >
                                    <Edit2 size={14} />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(category.id, category.is_active)}
                                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${category.is_active
                                            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100'
                                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100'
                                        }`}
                                >
                                    {category.is_active ? <PowerOff size={14} /> : <Power size={14} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id, category.name)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <CategoryForm
                    category={editingCategory}
                    onClose={handleCloseForm}
                    onSuccess={loadCategories}
                />
            )}
        </div>
    );
}
