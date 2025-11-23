import { DeliveryProduct } from '@/lib/delivery/types';
import { ProductCardList } from './ProductCardList';

interface ProductListProps {
  products: DeliveryProduct[];
  title?: string;
  emptyMessage?: string;
}

export function ProductList({ products, title, emptyMessage = 'Nenhum produto encontrado' }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 px-4 md:px-0">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
        {products.map((product) => (
          <ProductCardList key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
