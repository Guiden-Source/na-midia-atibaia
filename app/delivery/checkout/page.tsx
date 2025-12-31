'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearCart, formatPrice, validateCart } from '@/lib/delivery/cart';
import { createOrder } from '@/lib/delivery/queries';
import { ALLOWED_CONDOMINIUMS, PAYMENT_METHODS } from '@/lib/delivery/types';
import { ArrowLeft, AlertCircle, User, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/auth/hooks';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '@/lib/delivery/CartContext';
import { CouponInput } from '@/components/delivery/CouponInput';
import { validateCoupon, applyCouponToOrder, generateProgressiveCoupon, getUserOrderCount, markCouponAsUsed } from '@/lib/delivery/coupon-system';

interface CheckoutFormData {
  // Dados mínimos necessários
  whatsapp: string;
  receiver_name: string;
  condominium: string;
  block: string;
  apartment: string;
  payment_method: 'pix' | 'dinheiro' | 'cartao';
  change_for?: number;
  notes?: string;
  coupon_code?: string; // ← NOVO
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { items, total, scheduledTime, clearCart: contextClearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ← NOVO: Estados do cupom
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0); // Percentual (10, 15, 20)
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0); // Valor em R$
  const [isCouponValid, setIsCouponValid] = useState(false);

  // Calculate subtotal and delivery fee based on context items
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 0; // Always free

  // ← NOVO: Calcular total com desconto
  const finalTotal = isCouponValid ? subtotal - couponDiscountAmount : subtotal;

  const [formData, setFormData] = useState<CheckoutFormData>({
    whatsapp: '',
    receiver_name: '',
    condominium: '',
    block: '',
    apartment: '',
    payment_method: 'pix',
    change_for: undefined,
    notes: '',
    coupon_code: '', // ← NOVO
  });

  useEffect(() => {
    // Verificar se carrinho está vazio (apenas se não estiver submetendo)
    if (items.length === 0 && !isLoading) {
      // Small delay to allow context to load
      const timer = setTimeout(() => {
        if (items.length === 0 && !isLoading) {
          router.push('/delivery');
        }
      }, 500);
      return () => clearTimeout(timer);
    }

    // Pré-preencher dados do localStorage (se veio do Jerônimo)
    const savedBlock = localStorage.getItem('jeronimo_block');
    const savedApt = localStorage.getItem('jeronimo_apartment');

    if (savedBlock && savedApt) {
      setFormData(prev => ({
        ...prev,
        block: savedBlock,
        apartment: savedApt,
        condominium: 'Jeronimo de Camargo 1', // Padrão
      }));
    }

    // Pré-preencher nome do usuário
    if (user?.user_metadata?.full_name) {
      setFormData(prev => ({
        ...prev,
        receiver_name: user.user_metadata.full_name,
      }));
    }
  }, [router, user, authLoading, items.length]);

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

  // ← NOVO: Função para validar cupom
  const handleValidateCoupon = async (code: string): Promise<{ valid: boolean; discount: number; error?: string }> => {
    if (!code.trim()) {
      return { valid: false, discount: 0, error: 'Digite um código de cupom' };
    }

    if (!user?.email) {
      return { valid: false, discount: 0, error: 'Faça login para usar cupons' };
    }

    try {
      const result = await validateCoupon(code.toUpperCase(), user.email);

      if (result.valid) {
        // Calcular desconto em reais
        const discountAmount = (subtotal * result.discount) / 100;

        // Atualizar estados
        setCouponCode(code.toUpperCase());
        setCouponDiscount(result.discount);
        setCouponDiscountAmount(discountAmount);
        setIsCouponValid(true);
        setFormData(prev => ({ ...prev, coupon_code: code.toUpperCase() }));

        return { valid: true, discount: result.discount };
      } else {
        // Limpar estados se inválido
        setCouponCode('');
        setCouponDiscount(0);
        setCouponDiscountAmount(0);
        setIsCouponValid(false);
        setFormData(prev => ({ ...prev, coupon_code: '' }));

        return { valid: false, discount: 0, error: result.error };
      }
    } catch (error: any) {
      console.error('Erro ao validar cupom:', error);
      return { valid: false, discount: 0, error: 'Erro ao validar cupom. Tente novamente.' };
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.whatsapp) newErrors.whatsapp = 'WhatsApp é obrigatório';
    if (!formData.receiver_name) newErrors.receiver_name = 'Nome de quem vai receber é obrigatório';
    if (!formData.condominium) newErrors.condominium = 'Condomínio é obrigatório';
    if (!formData.block) newErrors.block = 'Bloco é obrigatório';
    if (!formData.apartment) newErrors.apartment = 'Apartamento é obrigatório';

    if (formData.payment_method === 'dinheiro' && formData.change_for && formData.change_for < total) {
      newErrors.change_for = 'O valor do troco deve ser maior que o total do pedido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar carrinho
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }

    // Validar formulário
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      // Criar pedido com dados completos
      const orderData = {
        user_name: formData.receiver_name, // Use form name as primary
        user_phone: formData.whatsapp,
        user_email: user?.email || '', // Optional for guests
        address_street: 'Residencial Jerônimo de Camargo', // Fixo
        address_number: formData.apartment,
        address_complement: `Bloco ${formData.block}`,
        address_condominium: formData.condominium,
        address_block: formData.block,
        address_apartment: formData.apartment,
        address_reference: '',
        payment_method: formData.payment_method,
        change_for: formData.change_for,
        notes: formData.notes || '',
      };

      // Converter itens do contexto para o formato esperado por createOrder
      const cartItemsForOrder = items.map(item => ({
        product: item,
        quantity: item.quantity
      }));

      const order = await createOrder(
        orderData,
        cartItemsForOrder,
        subtotal,
        deliveryFee,
        finalTotal, // ← Usar total com desconto
        user?.id // Optional
      );

      // ← NOVO: Marcar cupom como usado (se foi aplicado)
      if (isCouponValid && couponCode) {
        try {
          await markCouponAsUsed(couponCode);
          console.log('[Cupom] Marcado como usado:', couponCode);
        } catch (error) {
          console.error('[Cupom] Erro ao marcar como usado:', error);
          // Não bloqueia o pedido se falhar
        }
      }

      // ← NOVO: Gerar cupom progressivo para próximo pedido
      if (user?.email && user?.id) {
        try {
          // Contar quantos pedidos o usuário já fez (incluindo este)
          const orderCount = await getUserOrderCount(user.email);

          // Gerar cupom para próximo pedido
          const newCoupon = await generateProgressiveCoupon(
            user.email,
            user.id,
            orderCount, // Número do pedido que acabou de fazer
            finalTotal
          );

          console.log('[Cupom] Novo cupom gerado:', newCoupon.code, `(${newCoupon.discount_percentage}% OFF)`);

          // Mostrar toast com o novo cupom
          toast.success(
            `Pedido confirmado! Ganhou ${newCoupon.discount_percentage}% OFF no próximo: ${newCoupon.code}`,
            { duration: 6000 }
          );
        } catch (error) {
          console.error('[Cupom] Erro ao gerar novo cupom:', error);
          // Não bloqueia o pedido se falhar
          toast.success('Pedido confirmado com sucesso!');
        }
      } else {
        toast.success('Pedido confirmado com sucesso!');
      }

      // Limpar carrinho usando contexto
      contextClearCart();

      // Redirecionar para página de sucesso
      router.push(`/delivery/order-confirmed/${order.id}`);
      // Não setar isLoading(false) aqui para evitar que o useEffect dispare o redirect para /delivery
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      toast.error(`Erro ao processar pedido: ${error.message || 'Tente novamente.'}`);
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-24">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/delivery"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-bold transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Voltar ao cardápio</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-baloo2">
            Finalizar Pedido
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user ? (
              <>Olá, <strong>{user.user_metadata?.full_name || user.email}</strong>! Preencha os dados abaixo.</>
            ) : (
              <>Preencha os dados abaixo para finalizar seu pedido.</>
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados de Contato */}
              <LiquidGlass className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="text-orange-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">
                    Dados de Contato
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all ${errors.whatsapp ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      placeholder="(11) 99999-9999"
                    />
                    {errors.whatsapp && (
                      <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Nome de quem vai receber *
                    </label>
                    <input
                      type="text"
                      name="receiver_name"
                      value={formData.receiver_name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all ${errors.receiver_name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        }`}
                      placeholder="João da Silva"
                    />
                    {errors.receiver_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.receiver_name}</p>
                    )}
                  </div>
                </div>
              </LiquidGlass>

              {/* Endereço de Entrega */}
              <LiquidGlass className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-orange-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">
                    Endereço de Entrega
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Condomínio *
                    </label>
                    <select
                      name="condominium"
                      value={formData.condominium}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
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
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Bloco *
                      </label>
                      <input
                        type="text"
                        name="block"
                        autoCapitalize="characters"
                        value={formData.block}
                        onChange={handleInputChange}
                        
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                        placeholder="05"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Apartamento *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                        placeholder="42"
                      />
                    </div>
                  </div>
                </div>
              </LiquidGlass>

              {/* ← NOVO: Cupom de Desconto */}
              <LiquidGlass className="p-6">
                <CouponInput
                  value={couponCode}
                  onChange={setCouponCode}
                  onValidate={handleValidateCoupon}
                  discountApplied={couponDiscount}
                />
              </LiquidGlass>

              {/* Pagamento */}
              <LiquidGlass className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-orange-500" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">
                    Forma de Pagamento
                  </h2>
                </div>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.method}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payment_method === method.method
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.method}
                        checked={formData.payment_method === method.method}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-orange-500"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                {formData.payment_method === 'dinheiro' && (
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Troco para quanto?
                    </label>
                    <input
                      type="number"
                      name="change_for"
                      value={formData.change_for || ''}
                      onChange={handleInputChange}
                      step="0.01"
                      min={total}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                      placeholder={`Mínimo: ${formatPrice(total)}`}
                    />
                  </div>
                )}
              </LiquidGlass>

              {/* Observações */}
              <LiquidGlass className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-baloo2">
                  Observações (opcional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none outline-none transition-all"
                  placeholder="Alguma observação sobre o pedido? Ex: Deixar na portaria, tocar interfone, etc."
                />
              </LiquidGlass>

              {/* Erros gerais */}
              {Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">
                        Corrija os erros abaixo:
                      </h3>
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        {Object.values(errors).map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  `Finalizar Pedido - ${formatPrice(total)}`
                )}
              </button>
            </form>
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <LiquidGlass className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-baloo2">
                Resumo do Pedido
              </h2>

              {/* Agendamento */}
              {scheduledTime && (
                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    📅 Agendado para hoje às {scheduledTime}
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Taxa de entrega</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    GRÁTIS
                  </span>
                </div>

                {/* ← NOVO: Mostrar desconto do cupom */}
                {isCouponValid && couponDiscountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Cupom ({couponDiscount}% OFF)
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      -{formatPrice(couponDiscountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xl font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white font-baloo2">Total</span>
                  <span className="text-green-600 dark:text-green-400 font-baloo2">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </LiquidGlass>
          </div>
        </div>
      </div>
    </div>
  );
}
