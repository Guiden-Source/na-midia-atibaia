import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateOrderConfirmationEmail, generateOrderConfirmationText } from '@/lib/delivery/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();

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
        } = body;

        // Validações
        if (!customerEmail || !orderNumber) {
            return NextResponse.json(
                { error: 'Email e número do pedido são obrigatórios' },
                { status: 400 }
            );
        }

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
        });

        // Enviar email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Na Mídia Delivery <delivery@namidia.com.br>', // TODO: Configure seu domínio
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
    } catch (error: any) {
        console.error('Erro na API de email:', error);
        return NextResponse.json(
            { error: error.message || 'Erro interno' },
            { status: 500 }
        );
    }
}
