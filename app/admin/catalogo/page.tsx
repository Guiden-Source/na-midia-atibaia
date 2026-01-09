'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DeliveryProduct } from '@/lib/delivery/types';
import { formatPrice } from '@/lib/delivery/cart';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';

// Helper function to normalize Imgur URLs
function normalizeImgurUrl(url: string): string {
    if (!url) return url;

    // Convert Imgur page URL to direct image URL
    // https://imgur.com/ABC123 -> https://i.imgur.com/ABC123.png
    const imgurPagePattern = /^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/;
    const match = url.match(imgurPagePattern);

    if (match) {
        const imageId = match[1];
        // Try .png first (most common), will fallback if needed
        return `https://i.imgur.com/${imageId}.png`;
    }

    return url;
}

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
                        📱 Preview (Visualização vertical para WhatsApp/Stories)
                    </div>

                    <div
                        ref={catalogRef}
                        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-orange-900 p-0 overflow-hidden relative"
                        style={{ width: '1080px', margin: '0 auto', minHeight: '1920px' }}
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-black/50 to-transparent z-0" />
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col min-h-[1920px]">

                            {/* Header */}
                            <div className="pt-16 pb-12 px-12 text-center text-white">
                                <img
                                    src="/logotiponamidiavetorizado.svg"
                                    alt="Na Mídia Delivery"
                                    className="h-28 mx-auto mb-8 drop-shadow-[0_0_25px_rgba(255,165,0,0.5)] bg-white/10 p-4 rounded-3xl backdrop-blur-md"
                                />

                                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-600 px-10 py-4 rounded-full shadow-2xl mb-6 transform -rotate-1 border border-white/20">
                                    <span className="text-4xl">🔥</span>
                                    <span className="text-4xl font-black tracking-wider uppercase">Ofertas do Dia</span>
                                </div>

                                <div className="flex justify-center gap-4 text-orange-200 font-medium text-xl">
                                    <span className="bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                                        📅 Válido para hoje
                                    </span>
                                    <span className="bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                                        ⚡ Entrega em 30min
                                    </span>
                                </div>
                            </div>

                            {/* Products List - Vertical Layout */}
                            <div className="flex-1 px-12 py-4 space-y-6">
                                {products.slice(0, 8).map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="flex bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 transform transition-transform hover:scale-[1.01]"
                                        style={{ height: '200px' }}
                                    >
                                        {/* Product Image - Left Side */}
                                        <div className="w-[200px] min-w-[200px] h-full bg-white p-4 flex items-center justify-center relative overflow-hidden">
                                            {product.image_url ? (
                                                <img
                                                    src={normalizeImgurUrl(product.image_url)}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                    crossOrigin="anonymous"
                                                />
                                            ) : (
                                                <ImageIcon size={64} className="text-gray-300" />
                                            )}
                                            {product.discount_percentage && (
                                                <div className="absolute top-0 left-0 bg-red-600 text-white text-lg font-black px-3 py-1 rounded-br-2xl shadow-lg z-10">
                                                    -{product.discount_percentage}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info - Right Side */}
                                        <div className="flex-1 p-6 flex flex-col justify-center relative overflow-hidden">
                                            {/* decorative blob */}
                                            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                            <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight relative z-10 line-clamp-2">
                                                {product.name}
                                            </h3>

                                            <div className="flex items-end gap-4 mt-auto relative z-10">
                                                <div className="text-gray-400 text-xl font-medium line-through mb-1">
                                                    {formatPrice(product.price)}
                                                </div>
                                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-600 to-pink-600 tracking-tight">
                                                    {formatPrice(product.promotional_price!)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer CTA */}
                            <div className="mt-8 p-12 bg-black/40 backdrop-blur-xl border-t border-white/10">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 shadow-2xl flex items-center justify-between mb-8 transform hover:scale-[1.01] transition-transform">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-white/20 p-4 rounded-full">
                                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-green-100 text-lg font-medium mb-1">Peça pelo WhatsApp</div>
                                            <div className="text-white text-4xl font-black tracking-wide">(11) 94761-4823</div>
                                        </div>
                                    </div>
                                    <div className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-xl uppercase tracking-wider">
                                        Clique Aqui
                                    </div>
                                </div>

                                <div className="text-center text-white/60 text-lg uppercase tracking-[0.2em] font-medium">
                                    www.namidia.com.br
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
