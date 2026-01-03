import { OrderEmail } from '@/components/email/OrderEmail';
import { Resend } from 'resend';

export async function POST(request: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { orderId, customerName, total, items, address, toEmail } = await request.json();

        const { data, error } = await resend.emails.send({
            from: 'Delivery Na Mídia <onboarding@resend.dev>', // Change to your verified domain later
            to: [toEmail || 'guidjvb@gmail.com'], // Hardcoded for now per request "email to me"
            subject: `Novo Pedido #${orderId.slice(0, 8)} - ${customerName}`,
            react: OrderEmail({ orderId, customerName, total, items, address }),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json({ data });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
