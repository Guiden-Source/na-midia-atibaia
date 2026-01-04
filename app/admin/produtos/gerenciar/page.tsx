'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, PowerOff, Power, CheckSquare, Square, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { AdminHeader } from '@/components/admin/AdminHeader';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/delivery/cart';
import Image from 'next/image';

import { DeliveryProduct } from '@/types/delivery';

export default function GerenciarProdutosPage() {
    const [products, setProducts] = useState<DeliveryProduct[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const supabase = createClient();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('delivery_products')
            .select('*, category:delivery_categories(name)')
            .order('name');

        if (!error && data) {
            setProducts(data);
        }
        setIsLoading(false);
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        // Select only visible (filtered) products
        const visibleIds = filteredProducts.map(p => p.id);
        const allVisibleSelected = visibleIds.every(id => selectedIds.has(id));

        if (allVisibleSelected) {
            // Unselect all visible
            const newSet = new Set(selectedIds);
            visibleIds.forEach(id => newSet.delete(id));
            setSelectedIds(newSet);
        } else {
            // Select all visible
            const newSet = new Set(selectedIds);
            visibleIds.forEach(id => newSet.add(id));
            setSelectedIds(newSet);
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

    // Check if all VISIBLE products are selected
    const isAllVisibleSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.has(p.id));

    return (
        <div className="p-6 space-y-6">
            <AdminHeader
                title="Gerenciar Produtos em Massa"
                description="Ative, desative ou remova múltiplos produtos de uma vez"
            />

            {/* Bulk Actions & Search */}
            <LiquidGlass className="p-6 sticky top-4 z-20 backdrop-blur-md">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Link
                            href="/admin/produtos/importar"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
                        >
                            <Upload size={20} />
                            Importar
                        </Link>

                        <div className="h-full w-px bg-gray-300 dark:bg-gray-700 mx-2 hidden md:block"></div>

                        <button
                            onClick={handleBulkActivate}
                            disabled={selectedIds.size === 0 || isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 whitespace-nowrap"
                        >
                            <Power size={20} />
                            Ativar
                        </button>

                        <button
                            onClick={handleBulkDeactivate}
                            disabled={selectedIds.size === 0 || isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap"
                        >
                            <PowerOff size={20} />
                            Desativar
                        </button>

                        <button
                            onClick={handleBulkDelete}
                            disabled={selectedIds.size === 0 || isProcessing}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
                        >
                            <Trash2 size={20} />
                            Deletar
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                        >
                            {isAllVisibleSelected ? <CheckSquare size={18} className="text-orange-500" /> : <Square size={18} />}
                            {isAllVisibleSelected ? 'Desmarcar Visíveis' : 'Selecionar Visíveis'}
                        </button>
                    </div>
                    <div>
                        <span className="font-bold text-orange-600 dark:text-orange-400">{selectedIds.size}</span> selecionado(s)
                    </div>
                </div>
            </LiquidGlass>

            {/* Products Table */}
            <LiquidGlass className="overflow-hidden p-0">
                <div className="overflow-x-auto max-h-[70vh] relative">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-4 py-4 text-left w-12 bg-gray-50 dark:bg-gray-900">
                                    <button onClick={toggleSelectAll}>
                                        {isAllVisibleSelected ? <CheckSquare size={20} className="text-orange-500" /> : <Square size={20} className="text-gray-400" />}
                                    </button>
                                </th>
                                <th className="px-4 py-4 text-left font-bold w-16 bg-gray-50 dark:bg-gray-900">Img</th>
                                <th className="px-4 py-4 text-left font-bold bg-gray-50 dark:bg-gray-900">Produto</th>
                                <th className="px-4 py-4 text-left font-bold bg-gray-50 dark:bg-gray-900">Categoria</th>
                                <th className="px-4 py-4 text-left font-bold bg-gray-50 dark:bg-gray-900">Preço</th>
                                <th className="px-4 py-4 text-left font-bold bg-gray-50 dark:bg-gray-900">Estoque</th>
                                <th className="px-4 py-4 text-left font-bold bg-gray-50 dark:bg-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                // Skeleton Loading
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
                                        <td className="px-4 py-4"><div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-4 py-4"><div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div></td>
                                        <td className="px-4 py-4"><div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-4 py-4"><div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-4 py-4"><div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-4 py-4"><div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div></td>
                                        <td className="px-4 py-4"><div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-500">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className={`border-b border-gray-100 dark:border-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors ${selectedIds.has(product.id) ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
                                    >
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleSelect(product.id)} className="flex items-center justify-center p-2">
                                                {selectedIds.has(product.id) ?
                                                    <CheckSquare size={20} className="text-orange-500" /> :
                                                    <Square size={20} className="text-gray-400 group-hover:text-gray-600" />
                                                }
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                {product.image_url ? (
                                                    <Image
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="40px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold">
                                                        IMG
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{product.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-bold uppercase tracking-wider">
                                                {product.category?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className={product.promotional_price ? "line-through text-xs text-gray-400" : "font-medium"}>
                                                    {formatPrice(product.price)}
                                                </span>
                                                {product.promotional_price && (
                                                    <span className="text-orange-600 font-bold text-sm">
                                                        {formatPrice(product.promotional_price)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{product.stock ?? '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${product.is_active
                                                ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                                }`}>
                                                {product.is_active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </LiquidGlass>
        </div>
    );
}
