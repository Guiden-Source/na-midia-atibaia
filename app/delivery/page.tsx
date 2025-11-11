import { getProducts, getCategories } from '@/lib/delivery/queries';
import { ProductList } from '@/components/delivery/ProductList';
import Link from 'next/link';

export const metadata = {
  title: 'Delivery - Na Mídia Atibaia',
  description: 'Entrega grátis em 30 minutos no Jeronimo de Camargo 1 e 2',
};

export default async function DeliveryPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🛒 Delivery Na Mídia
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-100">
              Entrega grátis em 30 minutos! 🚀
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-sm md:text-base">
                📍 Atendemos: <strong>Jeronimo de Camargo 1 e 2</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Categorias
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/delivery?category=${category.slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Lista de Produtos */}
        <ProductList products={products} />
      </div>

      {/* Botão flutuante do carrinho (mobile) */}
      <Link
        href="/delivery/cart"
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all lg:hidden z-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </Link>
    </div>
  );
}
