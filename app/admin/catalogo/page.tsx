'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DeliveryProduct } from '@/lib/delivery/types';
import { formatPrice } from '@/lib/delivery/cart';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

export default function CatalogoPage() {
    const [products, setProducts] = useState<DeliveryProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const catalogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('delivery_products')
            .select('*')
            .eq('is_active', true)
            .not('promotional_price', 'is', null)
            .order('name');

        if (error) {
            console.error('Error loading products:', error);
            toast.error('Erro ao carregar produtos');
        } else {
            setProducts(data || []);
        }
        setIsLoading(false);
    }

    async function handleDownload() {
        if (!catalogRef.current) return;

        setIsGenerating(true);
        toast.loading('Gerando imagem...');

        try {
            const canvas = await html2canvas(catalogRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
            });

            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Failed to generate image');
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const date = new Date().toISOString().split('T')[0];
                link.download = `catalogo-ofertas-${date}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);

                toast.dismiss();
                toast.success('Imagem baixada com sucesso!');
            }, 'image/png');
        } catch (error) {
            console.error('Error generating image:', error);
            toast.dismiss();
            toast.error('Erro ao gerar imagem');
        } finally {
            setIsGenerating(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-baloo2 mb-2">
                    📸 Gerador de Catálogo
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Gere uma imagem com as ofertas do dia para compartilhar nos grupos
                </p>
            </div>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleDownload}
                    disabled={isGenerating || products.length === 0}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Gerando...
                        </>
                    ) : (
                        <>
                            <Download size={20} />
                            Baixar Imagem
                        </>
                    )}
                </button>

                <button
                    onClick={loadProducts}
                    className="flex items-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                    <Sparkles size={20} />
                    Atualizar
                </button>
            </div>

            {products.length === 0 ? (
                <LiquidGlass className="p-12 text-center">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Nenhuma oferta hoje
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Adicione preços promocionais nos produtos para gerar o catálogo
                    </p>
                </LiquidGlass>
            ) : (
                <LiquidGlass className="p-8">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        📱 Preview (a imagem final terá melhor qualidade)
                    </div>

                    <div
                        ref={catalogRef}
                        className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-8 rounded-2xl"
                        style={{ width: '1200px', margin: '0 auto' }}
                    >
                        <div className="text-center mb-8">
                            {/* Logo */}
                            <img
                                src="/logotiponamidiavetorizado.svg"
                                alt="Na Mídia Delivery"
                                className="h-20 mx-auto mb-4"
                                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                            />

                            <div className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full text-2xl font-bold shadow-xl">
                                🔥 OFERTAS DO DIA
                            </div>

                            {/* Urgência */}
                            <div className="mt-3 inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold animate-pulse">
                                ⏰ VÁLIDO SÓ HOJE! Aproveite enquanto dura
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {products.slice(0, 12).map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-orange-200"
                                >
                                    {product.image_url ? (
                                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                                            <ImageIcon size={64} className="text-orange-300" />
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                                            {product.name}
                                        </h3>

                                        <div className="space-y-1">
                                            <div className="text-gray-500 line-through text-lg">
                                                De: {formatPrice(product.price)}
                                            </div>
                                            <div className="text-3xl font-black text-orange-600">
                                                {formatPrice(product.promotional_price!)}
                                            </div>
                                            {product.discount_percentage && (
                                                <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    -{product.discount_percentage}% OFF
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl overflow-hidden">
                            <div className="grid grid-cols-2 gap-0">
                                {/* WhatsApp CTA */}
                                <div className="p-6 border-r-2 border-white/30">
                                    <div className="text-4xl mb-2">💬</div>
                                    <div className="text-2xl font-black mb-2">
                                        WhatsApp
                                    </div>
                                    <div className="text-lg font-bold bg-white/20 px-4 py-2 rounded-lg">
                                        (11) 94761-4823
                                    </div>
                                    <div className="text-xs mt-2 opacity-80">
                                        Clique para pedir
                                    </div>
                                </div>

                                {/* Site CTA */}
                                <div className="p-6">
                                    <div className="text-4xl mb-2">🌐</div>
                                    <div className="text-2xl font-black mb-2">
                                        Pelo Site
                                    </div>
                                    <div className="text-sm font-bold bg-white/20 px-4 py-2 rounded-lg">
                                        namidia.com.br
                                    </div>
                                    <div className="text-xs mt-2 opacity-80">
                                        Acesse agora
                                    </div>
                                </div>
                            </div>

                            {/* Rodapé */}
                            <div className="bg-black/20 py-3 text-center">
                                <div className="text-sm font-bold">
                                    ✅ Entrega GRÁTIS • Jerônimo de Camargo 1 e 2
                                </div>
                            </div>
                        </div>
                    </div>
                </LiquidGlass>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <LiquidGlass className="p-4">
                    <div className="text-2xl mb-2">💡</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Dica</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        A imagem é gerada automaticamente com os produtos que têm preço promocional ativo
                    </p>
                </LiquidGlass>

                <LiquidGlass className="p-4">
                    <div className="text-2xl mb-2">📱</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Compartilhe</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Baixe a imagem e envie direto nos grupos de WhatsApp ou Instagram Stories
                    </p>
                </LiquidGlass>

                <LiquidGlass className="p-4">
                    <div className="text-2xl mb-2">🔄</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Atualize</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clique em "Atualizar" para buscar as ofertas mais recentes antes de gerar
                    </p>
                </LiquidGlass>
            </div>
        </div>
    );
}
