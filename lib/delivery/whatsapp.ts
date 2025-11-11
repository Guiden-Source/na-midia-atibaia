// =====================================================
// DELIVERY SYSTEM - WHATSAPP INTEGRATION
// =====================================================

import type { DeliveryOrder, DeliveryOrderItem, PaymentMethod } from './types';
import { formatPhone } from './validation';

/**
 * Número do WhatsApp do estabelecimento
 * IMPORTANTE: Substituir pelo número real (formato: 5511999999999)
 */
const WHATSAPP_NUMBER = '5511999999999'; // TODO: Substituir pelo número real

/**
 * Formata mensagem do pedido para envio via WhatsApp
 */
export function formatOrderMessage(order: DeliveryOrder): string {
  const orderNumber = order.order_number || order.id.slice(0, 8);
  const createdAt = new Date(order.created_at).toLocaleString('pt-BR');
  
  // Formatar itens do pedido
  const itemsText = order.items
    ?.map((item) => {
      const itemTotal = item.price * item.quantity;
      return `• ${item.product_name} x${item.quantity} - R$ ${itemTotal.toFixed(2)}`;
    })
    .join('\n') || 'Sem itens';
  
  // Formatar endereço
  const addressParts = [
    order.address_street,
    order.address_number,
    order.address_complement,
    order.address_condominium,
    order.address_block ? `Bloco ${order.address_block}` : '',
    order.address_apartment ? `Apt ${order.address_apartment}` : '',
  ].filter(Boolean);
  
  const addressText = addressParts.join(', ');
  
  // Formatar pagamento
  const paymentText = formatPaymentMethod(order.payment_method, order.change_for);
  
  // Montar mensagem
  const message = `
🛒 *NOVO PEDIDO #${orderNumber}*

👤 *Cliente:* ${order.user_name}
📞 *Telefone:* ${formatPhone(order.user_phone)}
📍 *Endereço:* ${addressText}
${order.address_reference ? `🗺️ *Referência:* ${order.address_reference}` : ''}

*━━━━━━━━━━━━━━━━━━━*
*ITENS DO PEDIDO:*
${itemsText}
*━━━━━━━━━━━━━━━━━━━*

📦 *Subtotal:* R$ ${order.subtotal.toFixed(2)}
🚚 *Taxa de Entrega:* ${order.delivery_fee === 0 ? 'GRÁTIS' : `R$ ${order.delivery_fee.toFixed(2)}`}
💰 *TOTAL:* R$ ${order.total.toFixed(2)}

💳 *Pagamento:* ${paymentText}
${order.notes ? `\n📝 *Observações:* ${order.notes}` : ''}

_Pedido realizado em ${createdAt}_
_Via plataforma Na Mídia - Atibaia_
  `.trim();
  
  return message;
}

/**
 * Formata método de pagamento para exibição
 */
function formatPaymentMethod(method: PaymentMethod, changeFor?: number): string {
  switch (method) {
    case 'pix':
      return '📱 PIX (pagamento na entrega)';
    case 'dinheiro':
      if (changeFor && changeFor > 0) {
        return `💵 Dinheiro (troco para R$ ${changeFor.toFixed(2)})`;
      }
      return '💵 Dinheiro';
    case 'cartao':
      return '💳 Cartão (na entrega)';
    default:
      return method;
  }
}

/**
 * Gera link do WhatsApp com mensagem pré-formatada
 */
export function generateWhatsAppLink(order: DeliveryOrder): string {
  const message = formatOrderMessage(order);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Abre WhatsApp em uma nova aba
 */
export function openWhatsApp(order: DeliveryOrder): void {
  const link = generateWhatsAppLink(order);
  window.open(link, '_blank', 'noopener,noreferrer');
}

/**
 * Gera link para compartilhar pedido via WhatsApp (cliente para amigos)
 */
export function generateShareOrderLink(order: DeliveryOrder): string {
  const orderNumber = order.order_number || order.id.slice(0, 8);
  
  const message = `
🎉 *Acabei de fazer um pedido na Na Mídia!*

📦 Pedido: #${orderNumber}
🚀 Entrega em 30 minutos
💰 Total: R$ ${order.total.toFixed(2)}

Você também pode pedir! É super fácil e rápido:
🔗 https://namidia.com.br/delivery
  `.trim();
  
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Valida se o número do WhatsApp está configurado
 */
export function isWhatsAppConfigured(): boolean {
  return WHATSAPP_NUMBER !== '5511999999999';
}

/**
 * Retorna o número do WhatsApp configurado
 */
export function getWhatsAppNumber(): string {
  return WHATSAPP_NUMBER;
}

/**
 * Formata número para link do WhatsApp (remove caracteres especiais)
 */
export function formatWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}
