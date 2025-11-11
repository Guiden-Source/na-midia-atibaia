import { Cart } from '@/components/delivery/Cart';

export const metadata = {
  title: 'Carrinho - Delivery Na Mídia',
  description: 'Revise seus itens e finalize seu pedido',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Cart />
      </div>
    </div>
  );
}
