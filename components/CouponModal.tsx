"use client";
import { useEffect, useState } from 'react';

type Props = {
  code?: string;
  onClose: () => void;
  isOpen?: boolean;
};

export function CouponModal({ code, onClose, isOpen }: Props) {
  const [copied, setCopied] = useState(false);
  const open = Boolean(code) || Boolean(isOpen);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose, open]);

  if (!open) return null;

  async function copy() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 bg-white text-ink border-4 border-white rounded-2xl p-6 max-w-md w-full text-center shadow-retro">
        <h4 className="font-righteous text-2xl mb-2">Cupom Gerado!</h4>
        <p className="text-sm opacity-80 mb-4">Mostre este código no bar e garanta seu desconto:</p>
        <div className="coupon-badge mx-auto text-xl bg-accent text-ink">{code}</div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={copy} className="px-4 py-3 rounded-xl bg-primary text-white font-extrabold text-lg border-4 border-white shadow-retro">
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button onClick={onClose} className="px-4 py-3 rounded-xl bg-secondary text-white font-extrabold text-lg border-4 border-white shadow-retro">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
