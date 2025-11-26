'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, Minus, Plus, Package } from 'lucide-react';
import { DeliveryProduct } from '@/lib/delivery/types';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/delivery/CartContext';
import { formatPrice } from '@/lib/delivery/cart';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { toast } from 'react-hot-toast';

import { ImageWithZoom } from '@/components/ui/image-lightbox';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { addItem } = useCart();
    const [product, setProduct] = useState<DeliveryProduct | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProduct();
    }, [params.id]);

    const loadProduct = async () => {
        const { data, error } = await supabase
            .from('delivery_products')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error || !data) {
            toast.error('Produto não encontrado');
            router.push('/delivery');
            return;
        }

        setProduct(data);
        setIsLoading(false);
    };

    const handleAddToCart = () => {
        if (!product) return;

        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }

        toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
        router.push('/delivery');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const hasDiscount = product.original_price && product.original_price > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
        : 0;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 h-16 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        Detalhes do Produto
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Product Image */}
                <LiquidGlass className="mb-6 overflow-hidden">
                    <div className="relative w-full aspect-square md:aspect-video bg-gray-100 dark:bg-gray-800">
                        {product.image_url ? (
                            <ImageWithZoom
                                src={product.image_url}
                                alt={product.name}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl">
                                🍔
                            </div>
                        )}
                    </div>
                </LiquidGlass>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Title & Price */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-baloo2 mb-3">
                            {product.name}
                        </h2>

                        {/* Pricing */}
                        <div className="space-y-1">
                            {hasDiscount && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-400 line-through">
                                        {formatPrice(product.original_price!)}
                                    </span>
                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-bold">
                                        {discountPercentage}% OFF
                                    </span>
                                </div>
                            )}
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">/un</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <LiquidGlass className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                📋 Descrição
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </LiquidGlass>
                    )}

                    {/* Stock Info */}
                    <LiquidGlass className="p-6">
                        <div className="flex items-center gap-3">
                            <Package className="text-orange-500" size={24} />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    Estoque Disponível
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {product.stock > 0 ? (`${product.stock} unidades disponíveis`) : ('Produto esgotado')}
                                </p>
                            </div>
                        </div>
                    </LiquidGlass>
                </div>
            </div>

            {/* Sticky Bottom Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 pb-safe z-50">
                <div className="container mx-auto max-w-4xl flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-xl px-2 py-1">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            disabled={quantity >= product.stock}
                            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        {product.stock > 0 ? (
                            <span>Adicionar por {formatPrice(product.price * quantity)}</span>
                        ) : (
                            <span>Produto Esgotado</span>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}
