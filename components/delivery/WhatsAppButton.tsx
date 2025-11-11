'use client';

import { useState } from 'react';
import { DeliveryOrder } from '@/lib/delivery/types';
import { generateWhatsAppLink } from '@/lib/delivery/whatsapp';
import { markWhatsAppSent } from '@/lib/delivery/queries';
import { MessageCircle, ExternalLink } from 'lucide-react';

interface WhatsAppButtonProps {
  order: DeliveryOrder;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WhatsAppButton({ 
  order, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}: WhatsAppButtonProps) {
  const [isSending, setIsSending] = useState(false);

  const handleClick = async () => {
    setIsSending(true);

    try {
      // Gerar link do WhatsApp
      const whatsappLink = generateWhatsAppLink(order);

      // Marcar como enviado no banco de dados
      if (!order.whatsapp_sent) {
        await markWhatsAppSent(order.id);
      }

      // Abrir WhatsApp em nova aba
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      alert('Erro ao abrir WhatsApp. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSending}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
        rounded-lg font-semibold
        flex items-center justify-center gap-2
        transition-all duration-200
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-green-500/50
      `}
    >
      {isSending ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Abrindo...</span>
        </>
      ) : (
        <>
          <MessageCircle size={20} />
          <span>Enviar Pedido via WhatsApp</span>
          <ExternalLink size={16} />
        </>
      )}
    </button>
  );
}

// Variante compacta para usar em listas
export function WhatsAppButtonCompact({ order }: { order: DeliveryOrder }) {
  const handleClick = () => {
    const whatsappLink = generateWhatsAppLink(order);
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium transition-colors"
      title="Enviar via WhatsApp"
    >
      <MessageCircle size={16} />
      <span>WhatsApp</span>
    </button>
  );
}
