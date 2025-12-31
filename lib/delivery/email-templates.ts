import { formatPrice } from './cart';

interface OrderConfirmationEmailData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;

    // Localização
    condominium: string;
    tower: string;
    apartment: string;

    // Valores
    subtotal: number;
    deliveryFee: number;
    total: number;

    // Cupom (se usado)
    couponApplied?: {
        code: string;
        discount: number;
        discountAmount: number;
    };

    // Novo cupom gerado
    newCoupon?: {
        code: string;
        discount: number;
        expiresAt: string;
    };

    // Pagamento
    paymentMethod: string;
    changeFor?: number;

    // Items
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

/**
 * Gera HTML do email de confirmação
 */
export function generateOrderConfirmationEmail(data: OrderConfirmationEmailData): string {
    const {
        orderNumber,
        customerName,
        condominium,
        tower,
        apartment,
        subtotal,
        deliveryFee,
        total,
        couponApplied,
        newCoupon,
        paymentMethod,
        changeFor,
        items,
    } = data;

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedido Confirmado - Na Mídia Delivery</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                ✅ Pedido Confirmado!
              </h1>
              <p style="margin: 10px 0 0 0; color: #fed7aa; font-size: 16px;">
                Pedido #${orderNumber}
              </p>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Saudação -->
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">
                Olá <strong>${customerName}</strong>!
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Seu pedido foi confirmado com sucesso! 🎉<br>
                Estamos preparando tudo com muito carinho.
              </p>

              <!-- Endereço de Entrega -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin-bottom: 25px; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #92400e;">
                  📍 ENDEREÇO DE ENTREGA
                </p>
                <p style="margin: 0; font-size: 15px; color: #78350f;">
                  ${condominium}<br>
                  Torre ${tower} - Apartamento ${apartment}
                </p>
              </div>

              <!-- Resumo do Pedido -->
              <h3 style="margin: 30px 0 15px 0; font-size: 18px; color: #111827; font-weight: bold;">
                📦 Itens do Pedido
              </h3>
              
              <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
                ${items.map(item => `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="color: #6b7280; font-size: 14px;">
                      ${item.name} x${item.quantity}
                    </td>
                    <td align="right" style="color: #111827; font-weight: bold; font-size: 14px;">
                      ${formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                `).join('')}
                
                <!-- Subtotal -->
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="color: #6b7280; font-size: 14px; padding-top: 15px;">
                    Subtotal
                  </td>
                  <td align="right" style="color: #111827; font-weight: bold; font-size: 14px; padding-top: 15px;">
                    ${formatPrice(subtotal)}
                  </td>
                </tr>
                
                <!-- Taxa de Entrega -->
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="color: #6b7280; font-size: 14px;">
                    Taxa de entrega
                  </td>
                  <td align="right" style="color: #10b981; font-weight: bold; font-size: 14px;">
                    GRÁTIS
                  </td>
                </tr>

                ${couponApplied ? `
                  <!-- Desconto do Cupom -->
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="color: #6b7280; font-size: 14px;">
                      Cupom ${couponApplied.code} (${couponApplied.discount}% OFF)
                    </td>
                    <td align="right" style="color: #10b981; font-weight: bold; font-size: 14px;">
                      -${formatPrice(couponApplied.discountAmount)}
                    </td>
                  </tr>
                ` : ''}
                
                <!-- Total -->
                <tr>
                  <td style="color: #111827; font-size: 18px; font-weight: bold; padding-top: 15px;">
                    TOTAL
                  </td>
                  <td align="right" style="color: #10b981; font-weight: bold; font-size: 20px; padding-top: 15px;">
                    ${formatPrice(total)}
                  </td>
                </tr>
              </table>

              <!-- Forma de Pagamento -->
              <div style="background-color: #f3f4f6; padding: 15px 20px; margin-bottom: 25px; border-radius: 8px;">
                <p style="margin: 0 0 5px 0; font-size: 14px; color: #6b7280;">
                  💵 <strong>Forma de Pagamento:</strong>
                </p>
                <p style="margin: 0; font-size: 15px; color: #111827; font-weight: bold;">
                  ${paymentMethod.toUpperCase()}${changeFor ? ` (Troco para ${formatPrice(changeFor)})` : ''}
                </p>
              </div>

              <!-- Tempo de Entrega -->
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px 20px; margin-bottom: 25px; border-radius: 8px;">
                <p style="margin: 0; font-size: 15px; color: #1e40af;">
                  ⏰ <strong>Previsão de Entrega:</strong> 20 minutos
                </p>
              </div>

              ${newCoupon ? `
                <!-- Novo Cupom Gerado -->
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; margin: 30px 0; border-radius: 12px; text-align: center;">
                  <p style="margin: 0 0 10px 0; font-size: 16px; color: #d1fae5; font-weight: bold;">
                    🎁 GANHOU UM CUPOM!
                  </p>
                  <p style="margin: 0 0 15px 0; font-size: 14px; color: #d1fae5;">
                    Use no seu próximo pedido:
                  </p>
                  <div style="background-color: #ffffff; padding: 15px 20px; border-radius: 8px; display: inline-block;">
                    <p style="margin: 0; font-size: 24px; color: #059669; font-weight: bold; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                      ${newCoupon.code}
                    </p>
                  </div>
                  <p style="margin: 15px 0 0 0; font-size: 18px; color: #ffffff; font-weight: bold;">
                    ${newCoupon.discount}% OFF
                  </p>
                  <p style="margin: 5px 0 0 0; font-size: 13px; color: #d1fae5;">
                    Válido até ${new Date(newCoupon.expiresAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ` : ''}

              <!-- Mensagem Final -->
              <p style="margin: 20px 0; font-size: 15px; color: #374151; line-height: 1.6; text-align: center;">
                Obrigado por comprar com a gente! ❤️<br>
                <strong>Na Mídia Delivery</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Dúvidas? Entre em contato pelo Instagram 
                <a href="https://instagram.com/namidia.atibaia" style="color: #f97316; text-decoration: none; font-weight: bold;">@namidia.atibaia</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Gera texto plain do email (fallback)
 */
export function generateOrderConfirmationText(data: OrderConfirmationEmailData): string {
    const {
        orderNumber,
        customerName,
        condominium,
        tower,
        apartment,
        subtotal,
        total,
        couponApplied,
        newCoupon,
        paymentMethod,
        items,
    } = data;

    let text = `
✅ PEDIDO CONFIRMADO!
Pedido #${orderNumber}

Olá ${customerName}!

Seu pedido foi confirmado com sucesso! 🎉

📍 ENDEREÇO DE ENTREGA
${condominium}
Torre ${tower} - Apartamento ${apartment}

📦 ITENS DO PEDIDO
${items.map(item => `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join('\n')}

Subtotal: ${formatPrice(subtotal)}
Taxa de entrega: GRÁTIS
`;

    if (couponApplied) {
        text += `Cupom ${couponApplied.code} (${couponApplied.discount}% OFF): -${formatPrice(couponApplied.discountAmount)}\n`;
    }

    text += `\nTOTAL: ${formatPrice(total)}

💵 FORMA DE PAGAMENTO: ${paymentMethod.toUpperCase()}
⏰ PREVISÃO DE ENTREGA: 20 minutos
`;

    if (newCoupon) {
        text += `\n🎁 GANHOU UM CUPOM!
Use no próximo pedido: ${newCoupon.code}
Desconto: ${newCoupon.discount}% OFF
Válido até: ${new Date(newCoupon.expiresAt).toLocaleDateString('pt-BR')}
`;
    }

    text += `\nObrigado por comprar com a gente!
Na Mídia Delivery

Dúvidas? Instagram: @namidia.atibaia
  `;

    return text;
}
