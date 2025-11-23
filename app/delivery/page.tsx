import { getProducts, searchProducts } from '@/lib/delivery/queries';
import { ProductList } from '@/components/delivery/ProductList';
import { CategoryCarousel } from '@/components/delivery/CategoryCarousel';
import { HighlightsCarousel } from '@/components/delivery/HighlightsCarousel';
import { FloatingCart } from '@/components/delivery/FloatingCart';
import { getServerSession } from '@/lib/auth/server';

export const metadata = {
  title: 'Delivery - Na Mídia Atibaia',
  description: 'Entrega grátis em 30 minutos no Jeronimo de Camargo 1 e 2',
};

export default async function DeliveryPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const session = await getServerSession();
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
    products = await getProducts(categorySlug);
    title = `Categoria: ${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`;
  } else {
    products = await getProducts();
  }

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Visitante';

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Message */}
        {!search && (
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-baloo2">
              Olá, {userName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Escolha seus produtos favoritos e receba em até 30 minutos
            </p>
          </div>
        )}

        {/* Categories */}
        {!search && <CategoryCarousel />}

        {/* Destaques (Carousel) */}
        {!search && !categorySlug && (
          <HighlightsCarousel products={products.filter(p => p.is_featured)} />
        )}

        {/* Products List */}
        <div>
          <ProductList
            products={search || categorySlug ? products : products.filter(p => !p.is_featured)}
            title={search || categorySlug ? title : "Cardápio Completo"}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>

      {/* Floating Cart */}
      <FloatingCart />
    </main>
  );
}
