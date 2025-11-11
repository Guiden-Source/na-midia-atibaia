'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, clearCart, formatPrice, validateCart } from '@/lib/delivery/cart';
import { createOrder } from '@/lib/delivery/queries';
import { validateCheckoutForm } from '@/lib/delivery/validation';
import { Cart, CheckoutFormData, ALLOWED_CONDOMINIUMS, PAYMENT_METHODS } from '@/lib/delivery/types';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, delivery_fee: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    user_name: '',
    user_phone: '',
    user_email: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_condominium: '',
    address_block: '',
    address_apartment: '',
    address_reference: '',
    payment_method: 'pix',
    change_for: undefined,
    notes: '',
  });

  useEffect(() => {
    const loadedCart = getCart();
    setCart(loadedCart);

    // Verificar se carrinho está vazio
    if (loadedCart.items.length === 0) {
      router.push('/delivery/cart');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar carrinho
    const cartValidation = validateCart();
    if (!cartValidation.isValid) {
      alert(cartValidation.errors.join('\n'));
      return;
    }

    // Validar formulário
    const formValidation = validateCheckoutForm(formData);
    if (!formValidation.isValid) {
      setErrors(formValidation.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      // Criar pedido
      const order = await createOrder(
        formData,
        cart.items,
        cart.subtotal,
        cart.delivery_fee,
        cart.total
      );

      // Limpar carrinho
      clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      // Redirecionar para página de sucesso
      router.push(`/delivery/checkout/success/${order.id}`);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/delivery/cart"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Voltar ao carrinho</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Finalizar Pedido
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Dados Pessoais
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.user_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="João da Silva"
                    />
                    {errors.user_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Telefone (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      name="user_phone"
                      value={formData.user_phone}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        errors.user_phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.user_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.user_phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email (opcional)
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      value={formData.user_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Endereço de Entrega
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Condomínio *
                    </label>
                    <select
                      name="address_condominium"
                      value={formData.address_condominium}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Selecione o condomínio</option>
                      {ALLOWED_CONDOMINIUMS.map((cond) => (
                        <option key={cond} value={cond}>
                          {cond}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Rua/Avenida *
                      </label>
                      <input
                        type="text"
                        name="address_street"
                        value={formData.address_street}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Rua Principal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="address_number"
                        value={formData.address_number}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bloco
                      </label>
                      <input
                        type="text"
                        name="address_block"
                        value={formData.address_block}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="A"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Apartamento
                      </label>
                      <input
                        type="text"
                        name="address_apartment"
                        value={formData.address_apartment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="101"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="address_complement"
                      value={formData.address_complement}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Casa dos fundos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ponto de referência
                    </label>
                    <input
                      type="text"
                      name="address_reference"
                      value={formData.address_reference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Próximo à portaria principal"
                    />
                  </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Forma de Pagamento
                </h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.method}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.payment_method === method.method
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.method}
                        checked={formData.payment_method === method.method}
                        onChange={handleInputChange}
                        className="w-5 h-5"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                {formData.payment_method === 'dinheiro' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Troco para quanto?
                    </label>
                    <input
                      type="number"
                      name="change_for"
                      value={formData.change_for || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      min={cart.total}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder={`Mínimo: ${formatPrice(cart.total)}`}
                    />
                  </div>
                )}
              </div>

              {/* Observações */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Observações (opcional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Alguma observação sobre o pedido? Ex: Deixar na portaria, tocar interfone, etc."
                />
              </div>

              {/* Erros gerais */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                        Corrija os erros abaixo:
                      </h3>
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        {Object.values(errors).map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  `Finalizar Pedido - ${formatPrice(cart.total)}`
                )}
              </button>
            </form>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Taxa de entrega</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    GRÁTIS
                  </span>
                </div>

                <div className="flex items-center justify-between text-xl font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatPrice(cart.total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <span className="text-xl">ℹ️</span>
                  <div>
                    <p className="font-medium mb-1">Como funciona?</p>
                    <ol className="text-xs space-y-1">
                      <li>1. Finalize o pedido aqui</li>
                      <li>2. Envie pelo WhatsApp</li>
                      <li>3. Receba em 30 minutos! 🚀</li>
                    </ol>
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
