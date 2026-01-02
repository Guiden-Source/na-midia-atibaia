import * as React from 'react';

interface OrderEmailProps {
    orderId: string;
    customerName: string;
    total: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    address: string;
}

export const OrderEmail: React.FC<Readonly<OrderEmailProps>> = ({
    orderId,
    customerName,
    total,
    items,
    address,
}) => (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
        <h1 style={{ color: '#f97316' }}>Novo Pedido Recebido! 🛵</h1>
        <p>Olá! Você tem um novo pedido no Delivery Na Mídia.</p>

        <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', margin: '20px 0' }}>
            <p><strong>Pedido:</strong> #{orderId.slice(0, 8)}</p>
            <p><strong>Cliente:</strong> {customerName}</p>
            <p><strong>Endereço:</strong> {address}</p>
            <p><strong>Total:</strong> {total}</p>
        </div>

        <h3>Itens:</h3>
        <ul>
            {items.map((item, index) => (
                <li key={index}>
                    {item.quantity}x {item.name}
                </li>
            ))}
        </ul>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            Acesse o painel administrativo para ver mais detalhes e aceitar o pedido.
        </p>
    </div>
);
