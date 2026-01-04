import { NextResponse } from 'next/server';
// import { Resend } from 'resend'; // ← DESABILITADO: npm install resend quando ativar
// import { generateOrderConfirmationEmail, generateOrderConfirmationText } from '@/lib/delivery/email-templates';

// const resend = new Resend(process.env.RESEND_API_KEY); // ← DESABILITADO

/**
 * API Route para enviar emails de confirmação de pedido
 * 
 * ⚠️ STATUS: TEMPORARIAMENTE DESABILITADO
 * 
 * Motivo: Aguardando configuração do Resend
 * 
 * Para ativar:
 * 1. npm install resend
 * 2. Configurar RESEND_API_KEY no .env
 * 3. Descomentar código abaixo e imports
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, customerEmail } = body;

    // Validação básica
    if (!customerEmail || !orderNumber) {
      return NextResponse.json(
        { error: 'Email e número do pedido são obrigatórios' },
        { status: 400 }
      );
    }

    // ← RETORNO TEMPORÁRIO - Email desabilitado
    console.log('[Email] API chamada mas Resend não configurado:', {
      orderNumber,
      customerEmail,
      status: 'disabled'
    });

    return NextResponse.json({
      success: true,
      message: 'Email temporariamente desabilitado. Configure Resend para ativar.',
      emailId: null
    });

    /* ═══════════════════════════════════════════════════════
       CÓDIGO ORIGINAL (comentado até Resend estar configurado)
       ═══════════════════════════════════════════════════════
    
    const {
      orderNumber,
      customerName,
      customerEmail,
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
      notes,
    } = body;
 
    // Gerar HTML e texto do email
    const htmlContent = generateOrderConfirmationEmail({
      orderNumber,
      customerName,
      customerEmail,
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
      notes,
    });
 
    const textContent = generateOrderConfirmationText({
      orderNumber,
      customerName,
      customerEmail,
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
      notes,
    });
 
    // Enviar email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Na Mídia Delivery <delivery@namidia.com.br>',
      to: [customerEmail],
      subject: `✅ Pedido #${orderNumber} confirmado!`,
      html: htmlContent,
      text: textContent,
    });
 
    if (error) {
      console.error('Erro ao enviar email:', error);
      return NextResponse.json(
        { error: 'Falha ao enviar email de confirmação' },
        { status: 500 }
      );
    }
 
    console.log('[Email] Confirmação enviada:', {
      orderId: orderNumber,
      email: customerEmail,
      resendId: data?.id,
    });
 
    return NextResponse.json({ success: true, emailId: data?.id });
    
    ═══════════════════════════════════════════════════════ */

  } catch (error: any) {
    console.error('Erro na API de email:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
