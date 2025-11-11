'use client';

import { DeliveryProduct } from '@/lib/delivery/types';
import { formatPrice, calculateDiscount } from '@/lib/delivery/cart';
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/delivery/AddToCartButton';

interface ProductCardProps {
  product: DeliveryProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
    ? calculateDiscount(product.original_price!, product.price)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Badge de desconto */}
      {hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold shadow-lg">
          -{discountPercentage}%
        </div>
      )}

      {/* Badge de destaque */}
      {product.is_featured && !hasDiscount && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm font-bold shadow-lg">
          ⭐ Destaque
        </div>
      )}

      {/* Estoque baixo */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium">
          Últimas unidades!
        </div>
      )}

      {/* Esgotado */}
      {product.stock === 0 && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
            Esgotado
          </span>
        </div>
      )}

      {/* Imagem */}
      <Link href={`/delivery/${product.id}`} className="block">
        <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
              📦
            </div>
          )}
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Categoria */}
        {product.category && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <span>{product.category.icon}</span>
            <span>{product.category.name}</span>
          </div>
        )}

        {/* Nome */}
        <Link href={`/delivery/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Descrição */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Preço */}
        <div className="mb-3">
          {hasDiscount && (
            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {formatPrice(product.original_price!)}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /{product.unit}
            </span>
          </div>
        </div>

        {/* Botão adicionar ao carrinho */}
        <AddToCartButton 
          product={product} 
          disabled={product.stock === 0}
          className="w-full"
        />
      </div>
    </div>
  );
}
