'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, PowerOff, Power, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { AdminHeader } from '@/components/admin/AdminHeader';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/delivery/cart';

interface Product {
    id: string;
    name: string;
    price: number;
    promotional_price?: number;
    is_active: boolean;
    stock?: number;
    category?: { name: string };
}

export default function GerenciarProdutosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const { data, error } = await supabase
            .from('delivery_products')
            .select('id, name, price, promotional_price, is_active, stock, category:delivery_categories(name)')
            .order('name');

        if (!error && data) {
            setProducts(data);
        }
        setIsLoading(false);
    }

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === products.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(products.map(p => p.id)));
        }
    };

    const handleBulkDeactivate = async () => {
        if (selectedIds.size === 0) {
            toast.error('Selecione pelo menos um produto');
            return;
        }

        if (!confirm(`Desativar ${selectedIds.size} produto(s)?`)) return;

        setIsProcessing(true);
        const { error } = await supabase
            .from('delivery_products')
            .update({ is_active: false })
            .in('id', Array.from(selectedIds));

        if (error) {
            toast.error('Erro ao desativar produtos');
        } else {
            toast.success(`${selectedIds.size} produto(s) desativado(s)!`);
            setSelectedIds(new Set());
            loadProducts();
        }
        setIsProcessing(false);
    };

    const handleBulkActivate = async () => {
        if (selectedIds.size === 0) {
            toast.error('Selecione pelo menos um produto');
            return;
        }

        setIsProcessing(true);
        const { error } = await supabase
            .from('delivery_products')
            .update({ is_active: true })
            .in('id', Array.from(selectedIds));

        if (error) {
            toast.error('Erro ao ativar produtos');
        } else {
            toast.success(`${selectedIds.size} produto(s) ativado(s)!`);
            setSelectedIds(new Set());
            loadProducts();
        }
        setIsProcessing(false);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) {
            toast.error('Selecione pelo menos um produto');
            return;
        }

        if (!confirm(`ATENÇÃO: Deletar permanentemente ${selectedIds.size} produto(s)?`)) return;

        setIsProcessing(true);
        const { error } = await supabase
            .from('delivery_products')
            .delete()
            .in('id', Array.from(selectedIds));

        if (error) {
            toast.error('Erro ao deletar produtos');
        } else {
            toast.success(`${selectedIds.size} produto(s) deletado(s)!`);
            setSelectedIds(new Set());
            loadProducts();
        }
        setIsProcessing(false);
    };

    return (
        <div className="p-6 space-y-6">
            <AdminHeader
                title="Gerenciar Produtos em Massa"
                description="Ative, desative ou remova múltiplos produtos de uma vez"
            />

            {/* Bulk Actions */}
            <LiquidGlass className="p-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {selectedIds.size === products.length ? <CheckSquare size={20} /> : <Square size={20} />}
                            Selecionar Todos ({products.length})
                        </button>
                        <span className="text-sm text-gray-500">
                            {selectedIds.size} selecionado(s)
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href="/admin/produtos/importar"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <Upload size={20} />
                            Importar CSV
                        </Link>

                        <button
                            onClick={handleBulkActivate}
                            disabled={selectedIds.size === 0 || isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                            <Power size={20} />
                            Ativar
                        </button>

                        <button
                            onClick={handleBulkDeactivate}
                            disabled={selectedIds.size === 0 || isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                            <PowerOff size={20} />
                            Desativar
                        </button>

                        <button
                            onClick={handleBulkDelete}
                            disabled={selectedIds.size === 0 || isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            <Trash2 size={20} />
                            Deletar
                        </button>
                    </div>
                </div>
            </LiquidGlass>

            {/* Products Table */}
            <LiquidGlass className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left w-12"></th>
                                <th className="px-4 py-3 text-left font-bold">Produto</th>
                                <th className="px-4 py-3 text-left font-bold">Categoria</th>
                                <th className="px-4 py-3 text-left font-bold">Preço</th>
                                <th className="px-4 py-3 text-left font-bold">Promoção</th>
                                <th className="px-4 py-3 text-left font-bold">Estoque</th>
                                <th className="px-4 py-3 text-left font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(product.id)}
                                            onChange={() => toggleSelect(product.id)}
                                            className="w-4 h-4 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-medium">{product.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                        {product.category?.name || '-'}
                                    </td>
                                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                                    <td className="px-4 py-3">
                                        {product.promotional_price ? (
                                            <span className="text-orange-600 font-bold">
                                                {formatPrice(product.promotional_price)}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-3">{product.stock ?? '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {product.is_active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </LiquidGlass>
        </div>
    );
}
