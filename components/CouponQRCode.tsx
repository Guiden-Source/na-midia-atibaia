'use client';

import QRCodeSVG from 'react-qr-code';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CouponQRCodeProps {
  code: string;
  eventName: string;
  isUsed?: boolean;
  usedAt?: string;
}

export function CouponQRCode({ code, eventName, isUsed, usedAt }: CouponQRCodeProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // URL para validação do cupom
  const validationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/validar-cupom?code=${code}`;

  if (isUsed) {
    return (
      <div className="relative">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 opacity-50">
          <QRCodeSVG
            value={validationUrl}
            size={200}
            level="H"
            className="w-full h-auto"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full font-baloo2 font-bold shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            Cupom Usado
          </div>
        </div>
        {usedAt && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Usado em {new Date(usedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* QR Code */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-orange-500 shadow-lg">
        <QRCodeSVG
          value={validationUrl}
          size={200}
          level="H"
          className="w-full h-auto"
        />
      </div>

      {/* Código do cupom */}
      <div className="space-y-2">
        <p className="text-xs text-center text-muted-foreground font-medium">
          Código do Cupom
        </p>
        <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <code className="flex-1 text-center font-mono text-lg font-bold">
            {code}
          </code>
          <button
            onClick={copyCode}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Copiar código"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium">Como usar:</p>
        <p className="text-xs text-muted-foreground">
          Apresente este QR Code no bar ou mostre o código ao atendente
        </p>
      </div>
    </div>
  );
}
