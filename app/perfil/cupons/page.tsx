"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Ticket, Calendar, MapPin, Check, QrCode, ChevronLeft, Truck, Percent, Tag, Clock } from "lucide-react";
import QRCode from "react-qr-code";
import { getUserValidCoupons } from "@/lib/delivery/coupon-system";

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

interface DeliveryCoupon {
  id: string;
  code: string;
  discount_percentage: number;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export default function CuponsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cupons, setCupons] = useState<Coupon[]>([]);
  const [cuponsDelivery, setCuponsDelivery] = useState<DeliveryCoupon[]>([]);
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

      // Buscar cupons de eventos
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
        console.error("🎫 Cupons - Error loading event coupons:", error);
      } else {
        console.log('🎫 Cupons - Loaded event coupons:', data?.length || 0);
        setCupons((data as any) || []);
      }

      // Buscar cupons de delivery
      try {
        const deliveryCoupons = await getUserValidCoupons(user.email || "");
        console.log('🎫 Cupons - Loaded delivery coupons:', deliveryCoupons.length);
        setCuponsDelivery(deliveryCoupons);
      } catch (error) {
        console.error("🎫 Cupons - Error loading delivery coupons:", error);
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
  const totalCupons = disponíveis.length + cuponsDelivery.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-orange-400/10 to-pink-400/10 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/10 to-blue-400/10 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 pt-24 md:pt-28 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary font-medium transition-colors mb-6 group"
          >
            <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-all">
              <ChevronLeft size={20} />
            </div>
            <span className="font-baloo2">Voltar ao perfil</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Ticket size={32} />
            </div>
            <div>
              <h1 className="font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Meus Cupons
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie seus cupons de desconto
              </p>
            </div>
          </div>
        </div>
        {/* Cupons de Delivery */}
        {cuponsDelivery.length > 0 && (
          <div className="mb-8">
            <h2 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              Cupons de Delivery ({cuponsDelivery.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cuponsDelivery.map((cupom) => {
                const expiresAt = new Date(cupom.expires_at);
                const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isExpiringSoon = daysUntilExpiry <= 7;

                return (
                  <div
                    key={cupom.id}
                    className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-500/50 dark:border-green-400/50 p-6 transition-all hover:scale-105 hover:shadow-xl"
                  >
                    {/* Badge disponível */}
                    <div className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 mb-4">
                      <Percent className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-bold text-green-700 dark:text-green-300">
                        {cupom.discount_percentage}% OFF
                      </span>
                    </div>

                    <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Desconto no Delivery
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Válido até {expiresAt.toLocaleDateString('pt-BR')}
                        {isExpiringSoon && (
                          <span className="text-orange-600 dark:text-orange-400 font-semibold ml-1">
                            ({daysUntilExpiry} {daysUntilExpiry === 1 ? 'dia' : 'dias'})
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-4 mb-4 text-center">
                      <p className="text-xs text-white/80 mb-1">Código do cupom</p>
                      <p className="font-mono text-lg font-bold text-white">
                        {cupom.code}
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        <strong>Como usar:</strong> Copie o código e cole no campo "Cupom" durante o checkout.
                        {isExpiringSoon && ' ⚠️ Expira em breve!'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cupons de Eventos - Disponíveis */}
        <div className="mb-8">
          <h2 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            Cupons de Eventos ({disponíveis.length})
          </h2>

          {disponíveis.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 p-8 text-center">
              <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                Você ainda não tem cupons de eventos.
                <br />
                Confirme presença em eventos para ganhar cupons de bebida!
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
