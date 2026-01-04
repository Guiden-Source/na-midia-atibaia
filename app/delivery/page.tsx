import { getProducts, searchProducts } from '@/lib/delivery/queries';
import { ProductList } from '@/components/delivery/ProductList';
import { CategoryCarousel } from '@/components/delivery/CategoryCarousel';
import { HighlightsCarousel } from '@/components/delivery/HighlightsCarousel';
import { FloatingCart } from '@/components/delivery/FloatingCart';
import { ErrorFallback } from '@/components/delivery/ErrorFallback';
import { getServerSession } from '@/lib/auth/server';
import { getHeroMessage } from '@/lib/delivery/time-utils';
import type { DeliveryProduct } from '@/lib/delivery/types';

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

  let products: DeliveryProduct[] = [];
  let title = "Destaques para você";
  let emptyMessage = "Nenhum produto encontrado nesta categoria";
  let hasError = false;
  let errorMessage = "";

  try {
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
  } catch (error) {
    console.error('[Delivery Page] Erro ao carregar produtos:', error);
    hasError = true;
    errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
  }

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Visitante';
  const heroData = getHeroMessage(userName);

  // Show error fallback if there was an error
  if (hasError) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24">
        <ErrorFallback
          title="Ops! Não conseguimos carregar os produtos"
          message="Estamos preparando os melhores produtos para você. Por favor, tente novamente em alguns momentos."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Dynamic Welcome Hero */}
        {!search && (
          <div className={`p-6 md:p-8 rounded-2xl transition-all ${heroData.mood === 'night'
              ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 dark:from-purple-900/40 dark:to-pink-900/40'
              : 'bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200/50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700'
            }`}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-baloo2">
              {heroData.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-2 font-semibold">
              {heroData.subtitle}
            </p>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-1">
              {heroData.cta}
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
