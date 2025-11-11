'use client';

import { DeliveryProduct } from '@/lib/delivery/types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: DeliveryProduct[];
  title?: string;
  emptyMessage?: string;
}

export function ProductList({ products, title, emptyMessage = 'Nenhum produto encontrado' }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
