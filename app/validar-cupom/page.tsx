'use client';

import { useState } from 'react';
import { validateCoupon } from '@/app/actions';
import { Check, X, Scan, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function ValidarCupomPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Pegar código da URL se existir
  useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('code');
      if (urlCode) {
        setCode(urlCode);
        handleValidate(urlCode);
      }
    }
  });

  const handleValidate = async (codeToValidate?: string) => {
    const validationCode = codeToValidate || code;
    
    if (!validationCode.trim()) {
      toast.error('Digite o código do cupom');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await validateCoupon(validationCode);
      
      if (response.success) {
        setResult({
          success: true,
          message: 'Cupom validado com sucesso! ✅'
        });
        toast.success('Cupom validado! Pode servir a bebida 🍺');
        setCode('');
      } else {
        setResult({
          success: false,
          message: response.error || 'Cupom inválido ou já usado'
        });
        toast.error(response.error || 'Cupom inválido');
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao validar cupom'
      });
      toast.error('Erro ao validar cupom');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logotiponamidiavetorizado.svg"
                alt="Na Mídia"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Voltar
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 shadow-lg">
              <Scan className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Validação de Cupons</span>
            </div>

            <h1 className="font-baloo2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Validar Cupom
            </h1>

            <p className="text-muted-foreground">
              Digite o código do cupom ou escaneie o QR Code
            </p>
          </div>

          {/* Validation Form */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  Código do Cupom
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="NAMIDIA-XXXXX"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-lg"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-baloo2 font-semibold hover:from-orange-600 hover:to-pink-600 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Validar Cupom
                  </>
                )}
              </button>
            </form>

            {/* Result */}
            {result && (
              <div
                className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100'
                }`}
              >
                {result.success ? (
                  <Check className="w-6 h-6 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-6 h-6 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">
                    {result.success ? 'Sucesso!' : 'Erro'}
                  </p>
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">📱 Como usar:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Digite o código manualmente ou escaneie o QR Code</li>
                <li>Clique em "Validar Cupom"</li>
                <li>Se válido, pode servir a bebida ao cliente</li>
                <li>Cupons só podem ser usados uma vez</li>
              </ol>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <p className="text-sm text-orange-900 dark:text-orange-100">
              <strong>💡 Dica:</strong> Para escanear QR Codes, use a câmera do seu celular ou um app de leitura de QR Code. 
              O código será preenchido automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
