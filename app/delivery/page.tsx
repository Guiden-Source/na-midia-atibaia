import { getProducts, searchProducts } from '@/lib/delivery/queries';
import { ProductList } from '@/components/delivery/ProductList';
import Link from 'next/link';
import { DeliveryHeader } from '@/components/delivery/DeliveryHeader';
import { CategoryCarousel } from '@/components/delivery/CategoryCarousel';
import { BannerCarousel } from '@/components/delivery/BannerCarousel';
import { ShoppingBag } from 'lucide-react';

export const metadata = {
  title: 'Delivery - Na Mídia Atibaia',
  description: 'Entrega grátis em 30 minutos no Jeronimo de Camargo 1 e 2',
};

export default async function DeliveryPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const search = searchParams.search;
  const categorySlug = searchParams.category;

  let products = [];
  let title = "Destaques para você";
  let emptyMessage = "Nenhum produto encontrado nesta categoria";

  if (search) {
    products = await searchProducts(search);
    title = `Resultados para "${search}"`;
    emptyMessage = `Nenhum produto encontrado para "${search}"`;
  } else if (categorySlug) {
    products = await getProducts(search, categorySlug);
    title = `Categoria: ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`;
  } else {
    products = await getProducts();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-[150px] md:pt-[120px]">
      {/* New Header */}
      <DeliveryHeader />

      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Only show Banners and Categories on home (no search) */}
        {!search && (
          <>
            <BannerCarousel />
            <CategoryCarousel />
          </>
        )}

        {/* Main Content */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <ProductList products={products} emptyMessage={emptyMessage} />
      </div>


    </main>
  );
}
