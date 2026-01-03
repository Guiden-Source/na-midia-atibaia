import * as React from 'react';

interface OrderEmailProps {
    orderId: string;
    customerName: string;
    customerPhone?: string;
    total: string;
    subtotal: string;
    deliveryFee: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    address: {
        street: string;
        number: string;
        complement: string;
        condominium: string;
        neighborhood?: string;
        city?: string;
    };
    payment: {
        method: string;
        change?: string | null;
    };
}

export const OrderEmail: React.FC<Readonly<OrderEmailProps>> = ({
    orderId,
    customerName,
    customerPhone,
    total,
    subtotal,
    deliveryFee,
    items,
    address,
    payment,
}) => (
    <div style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: '#f3f4f6',
        padding: '40px 0',
    }}>
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(to right, #f97316, #ec4899)',
                padding: '30px',
                textAlign: 'center',
            }}>
                <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Novo Pedido! 🎉</h1>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: '10px 0 0 0', fontSize: '16px' }}>
                    {orderId}
                </p>
            </div>

            <div style={{ padding: '30px' }}>
                {/* Cliente */}
                <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', color: '#111827', margin: '0 0 15px 0' }}>👤 Cliente</h2>
                    <p style={{ margin: '5px 0', color: '#4b5563' }}><strong>Nome:</strong> {customerName}</p>
                    {customerPhone && <p style={{ margin: '5px 0', color: '#4b5563' }}><strong>WhatsApp:</strong> {customerPhone}</p>}
                </div>

                {/* Endereço */}
                <div style={{ marginBottom: '30px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
                    <h2 style={{ fontSize: '18px', color: '#111827', margin: '0 0 15px 0' }}>📍 Entrega</h2>
                    <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                        <p style={{ margin: '0 0 5px 0', color: '#111827', fontWeight: 'bold' }}>{address.condominium}</p>
                        <p style={{ margin: '0', color: '#4b5563' }}>{address.street}, {address.number}</p>
                        <p style={{ margin: '5px 0 0 0', color: '#4b5563' }}>{address.complement}</p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>{address.city}</p>
                    </div>
                </div>

                {/* Pedido */}
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '18px', color: '#111827', margin: '0 0 15px 0' }}>🛍️ Itens</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px 0', color: '#4b5563' }}>
                                        <span style={{ fontWeight: 'bold', marginRight: '8px', color: '#f97316' }}>{item.quantity}x</span>
                                        {item.name}
                                    </td>
                                    {/* Preço poderia vir aqui se passado no map */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagamento e Totais */}
                <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ color: '#6b7280' }}>Pagamento</span>
                        <span style={{ fontWeight: 'bold', color: '#111827' }}>
                            {payment.method}
                            {payment.change && ` (Troco p/ ${payment.change})`}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ color: '#6b7280' }}>Subtotal</span>
                        <span style={{ color: '#111827' }}>{subtotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ color: '#6b7280' }}>Taxa</span>
                        <span style={{ color: '#10b981' }}>{deliveryFee}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '15px',
                        paddingTop: '15px',
                        borderTop: '1px solid #e5e7eb',
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}>
                        <span style={{ color: '#111827' }}>Total</span>
                        <span style={{ color: '#f97316' }}>{total}</span>
                    </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <a
                        href="https://na-midia-atibaia.vercel.app/admin/pedidos"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#f97316',
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                        }}
                    >
                        Gerenciar Pedido
                    </a>
                </div>
            </div>
            <div style={{ backgroundColor: '#f3f4f6', padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                <p style={{ margin: 0 }}>Enviado automaticamente por Delivery Na Mídia</p>
            </div>
        </div>
    </div>
);
