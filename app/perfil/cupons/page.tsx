"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ticket, Calendar, MapPin, Check, QrCode, ChevronLeft } from "lucide-react";
import QRCode from "react-qr-code";

interface Coupon {
  id: string;
  code: string;
  used_at: string | null;
  created_at: string;
  event: {
    id: string;
    name: string;
    location: string;
    start_time: string;
    image_url?: string | null;
  };
}

export default function CuponsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cupons, setCupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const loadCupons = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('🎫 Cupons - User not logged in, redirecting to login');
        router.push("/login");
        return;
      }

      console.log('🎫 Cupons - Loading for user:', user.email);

      const { data, error } = await supabase
        .from("coupons")
        .select(`
          id,
          code,
          used_at,
          created_at,
          event:events (
            id,
            name,
            location,
            start_time,
            image_url
          )
        `)
        .eq("user_email", user.email || "")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("🎫 Cupons - Error loading coupons:", error);
      } else {
        console.log('🎫 Cupons - Loaded coupons:', data?.length || 0, 'cupons');
        console.log('🎫 Cupons - Data:', data);
        setCupons((data as any) || []);
      }

      setLoading(false);
    };

    loadCupons();
  }, [router]);

  const handleUseCoupon = async (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowQR(true);
  };

  const handleMarkAsUsed = async () => {
    if (!selectedCoupon) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("coupons")
      .update({ used_at: new Date().toISOString() })
      .eq("id", selectedCoupon.id);

    if (!error) {
      setCupons(cupons.map(c => 
        c.id === selectedCoupon.id 
          ? { ...c, used_at: new Date().toISOString() }
          : c
      ));
      setShowQR(false);
      setSelectedCoupon(null);
    }
  };

  const disponíveis = cupons.filter(c => !c.used_at);
  const usados = cupons.filter(c => c.used_at);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/perfil" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white">
                Meus Cupons
              </h1>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Cupons Disponíveis */}
        <div className="mb-8">
          <h2 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            Disponíveis ({disponíveis.length})
          </h2>

          {disponíveis.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 p-8 text-center">
              <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Você ainda não tem cupons disponíveis.
                <br />
                Confirme presença em eventos para ganhar cupons!
              </p>
              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-primary hover:bg-orange-600 px-6 py-3 font-baloo2 font-semibold text-white transition-colors"
              >
                Ver Eventos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disponíveis.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-500/50 dark:border-green-400/50 p-6 transition-all hover:scale-105 hover:shadow-xl"
                >
                  {/* Badge disponível */}
                  <div className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 mb-4">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-bold text-green-700 dark:text-green-300">
                      Disponível
                    </span>
                  </div>

                  <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {coupon.event.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(coupon.event.start_time).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{coupon.event.location}</span>
                  </div>

                  <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-3 mb-4 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Código do cupom</p>
                    <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                      {coupon.code}
                    </p>
                  </div>

                  <button
                    onClick={() => handleUseCoupon(coupon)}
                    className="w-full rounded-xl bg-primary hover:bg-orange-600 px-4 py-3 font-baloo2 font-semibold text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode className="h-5 w-5" />
                    Mostrar QR Code
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cupons Usados */}
        {usados.length > 0 && (
          <div>
            <h2 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Check className="h-6 w-6 text-gray-500" />
              Já Utilizados ({usados.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {usados.map((coupon) => (
                <div
                  key={coupon.id}
                  className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-700 p-6 opacity-60"
                >
                  {/* Badge usado */}
                  <div className="inline-flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 mb-4">
                    <Check className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Utilizado
                    </span>
                  </div>

                  <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {coupon.event.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Usado em {new Date(coupon.used_at!).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                      })}
                    </span>
                  </div>

                  <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-3 text-center">
                    <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      {coupon.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 max-w-md w-full shadow-2xl">
            <h3 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Seu Cupom
            </h3>

            <div className="rounded-2xl bg-white p-6 mb-6 flex items-center justify-center">
              <QRCode value={selectedCoupon.code} size={200} />
            </div>

            <div className="rounded-xl bg-gray-100 dark:bg-gray-700 p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Código</p>
              <p className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCoupon.code}
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              Mostre este QR Code ou o código para o estabelecimento
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowQR(false);
                  setSelectedCoupon(null);
                }}
                className="flex-1 rounded-xl border-2 border-gray-300 dark:border-gray-600 px-4 py-3 font-baloo2 font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
              <button
                onClick={handleMarkAsUsed}
                className="flex-1 rounded-xl bg-primary hover:bg-orange-600 px-4 py-3 font-baloo2 font-semibold text-white transition-colors"
              >
                Marcar como Usado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
