import { getProductById } from '@/lib/delivery/queries';
import { formatPrice, calculateDiscount } from '@/lib/delivery/cart';
import { AddToCartButton } from '@/components/delivery/AddToCartButton';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    return {
      title: 'Produto não encontrado',
    };
  }

  return {
    title: `${product.name} - Delivery Na Mídia`,
    description: product.description || `Compre ${product.name} com entrega grátis em 30 minutos`,
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount
    ? calculateDiscount(product.original_price!, product.price)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/delivery"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar para produtos</span>
          </Link>
        </div>

        {/* Produto */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Imagem */}
            <div className="relative">
              {hasDiscount && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                  -{discountPercentage}% OFF
                </div>
              )}

              {product.is_featured && !hasDiscount && (
                <div className="absolute top-4 left-4 z-10 bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                  ⭐ Destaque
                </div>
              )}

              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-4 right-4 z-10 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  Últimas unidades!
                </div>
              )}

              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-9xl">
                    📦
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes */}
            <div className="flex flex-col">
              {/* Categoria */}
              {product.category && (
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 flex items-center gap-2">
                  <span>{product.category.icon}</span>
                  <span>{product.category.name}</span>
                </div>
              )}

              {/* Nome */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>

              {/* Descrição */}
              {product.description && (
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                  {product.description}
                </p>
              )}

              {/* Preço */}
              <div className="mb-6">
                {hasDiscount && (
                  <div className="text-lg text-gray-500 dark:text-gray-400 line-through mb-1">
                    De: {formatPrice(product.original_price!)}
                  </div>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xl text-gray-500 dark:text-gray-400">
                    /{product.unit}
                  </span>
                </div>
              </div>

              {/* Adicionar ao carrinho */}
              <div className="mb-6">
                <AddToCartButton product={product} disabled={product.stock === 0} />
              </div>

              {/* Informações de entrega */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Entrega grátis em 30 minutos
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Para Jeronimo de Camargo 1 e 2
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Pagamento na entrega
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      PIX, Dinheiro ou Cartão
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Pedido via WhatsApp
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Simples e direto
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
