import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Gift, Calendar, MapPin, Check, Clock, QrCode, Truck, Tag, Percent } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { CouponQRCode } from "@/components/CouponQRCode";
import { LoginPromptPage } from "@/components/LoginPromptPage";
import { getUserValidCoupons } from "@/lib/delivery/coupon-system";
import { formatPrice } from "@/lib/delivery/cart";
import Image from "next/image";

export default async function CuponsPage() {
  const supabase = createSupabaseServerClient(true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Show login prompt for non-authenticated users
  if (!user) {
    return (
      <LoginPromptPage
        title="Faça login para ver seus cupons"
        message="Confirme presença em eventos e ganhe cupons de bebida grátis!"
        benefits={[
          "🍺 Cupons de bebida em eventos",
          "✅ Confirmação de presença rápida",
          "🔔 Notificações de novos eventos",
        ]}
        redirectUrl="/cupons"
      />
    );
  }

  // Get user's EVENT coupons
  const { data: coupons } = await supabase
    .from("coupons")
    .select(`
      id,
      code,
      is_used,
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
    .eq("user_email", user.email || "");

  // Get user's DELIVERY coupons (progressive)
  const deliveryCoupons = await getUserValidCoupons(user.email || "");

  const cuponsEvento = coupons || [];
  const cuponsDelivery = deliveryCoupons || [];
  const totalCupons = cuponsEvento.length + cuponsDelivery.length;

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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 shadow-lg">
              <Gift className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{totalCupons} {totalCupons === 1 ? 'Cupom' : 'Cupons'} Disponíveis</span>
            </div>

            <h1 className="font-baloo2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Meus Cupons
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cupons de bebida dos eventos e descontos progressivos do delivery.
              Use-os antes da data de validade! 🎁
            </p>
          </div>

          {/* Cupons list */}
          {totalCupons === 0 ? (
            <LiquidGlassCard className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 flex items-center justify-center">
                  <Gift className="w-10 h-10 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-baloo2 text-xl font-semibold mb-2">
                    Nenhum cupom ainda
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Confirme presença em eventos e faça pedidos no delivery!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    🍺 Cupons de bebida em eventos | 🍕 Descontos progressivos no delivery (10%→15%→20%)
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="/#eventos"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-baloo2 font-semibold hover:from-orange-600 hover:to-pink-600 transition-all hover:scale-105"
                  >
                    Ver Eventos
                  </a>
                  <a
                    href="/delivery"
                    className="px-6 py-3 rounded-full border-2 border-orange-500 text-orange-500 font-baloo2 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                  >
                    Fazer Pedido
                  </a>
                </div>
              </div>
            </LiquidGlassCard>
          ) : (
            <div className="space-y-8">
              {/* Delivery Coupons Section */}
              {cuponsDelivery.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-orange-500" />
                    <h2 className="font-baloo2 text-2xl font-bold">Cupons de Delivery</h2>
                    <span className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-semibold">
                      {cuponsDelivery.length}
                    </span>
                  </div>

                  <div className="grid gap-4">
                    {cuponsDelivery.map((cupom: any) => {
                      const expiresAt = new Date(cupom.expires_at);
                      const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      const isExpiringSoon = daysUntilExpiry <= 7;

                      return (
                        <LiquidGlassCard
                          key={cupom.id}
                          className="p-6"
                          gradientBorder
                          hover
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              {/* Código do cupom */}
                              <div className="flex items-center gap-3">
                                <Tag className="w-5 h-5 text-orange-500" />
                                <code className="text-xl font-mono font-bold bg-orange-100 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
                                  {cupom.code}
                                </code>
                              </div>

                              {/* Detalhes */}
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Percent className="w-4 h-4 text-green-500" />
                                  <span className="font-semibold text-green-600 dark:text-green-400">
                                    {cupom.discount_percentage}% de desconto
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Válido até {expiresAt.toLocaleDateString('pt-BR')}
                                  {isExpiringSoon && (
                                    <span className="text-orange-600 dark:text-orange-400 font-semibold">
                                      ({daysUntilExpiry} {daysUntilExpiry === 1 ? 'dia' : 'dias'})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Badge de desconto */}
                            <div className="text-center">
                              <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                                <Percent className="w-6 h-6" />
                                <span className="text-3xl font-bold font-baloo2">{cupom.discount_percentage}%</span>
                                <span className="text-xs opacity-90">de desconto</span>
                              </div>
                            </div>
                          </div>

                          {/* Instruções */}
                          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <p className="text-xs text-green-900 dark:text-green-100">
                              <strong>Como usar:</strong> Copie o código acima e cole no campo "Cupom" durante o checkout do delivery.
                              {isExpiringSoon && ' ⚠️ Este cupom expira em breve!'}
                            </p>
                          </div>
                        </LiquidGlassCard>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Event Coupons Section */}
              {cuponsEvento.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5 text-orange-500" />
                    <h2 className="font-baloo2 text-2xl font-bold">Cupons de Eventos</h2>
                    <span className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-semibold">
                      {cuponsEvento.length}
                    </span>
                  </div>

                  <div className="grid gap-6">
                    {cuponsEvento.map((evento: any) => (
                      <LiquidGlassCard
                        key={evento.id}
                        className="p-0 overflow-hidden"
                        gradientBorder
                        hover
                      >
                        <div className="flex flex-col lg:flex-row gap-6 p-6">
                          {/* QR Code Section */}
                          <div className="flex justify-center lg:justify-start">
                            <CouponQRCode
                              code={evento.code}
                              eventName={evento.event.name}
                              isUsed={evento.is_used}
                              usedAt={evento.used_at}
                            />
                          </div>

                          {/* Event details */}
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="font-baloo2 text-2xl font-bold mb-2">
                                {evento.event.name}
                              </h3>

                              <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(evento.event.start_time).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>

                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {evento.event.location}
                                </div>
                              </div>
                            </div>

                            {/* Cupom badge */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-baloo2 font-semibold ${evento.is_used
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                              }`}>
                              <Check className="w-4 h-4" />
                              {evento.is_used ? 'Cupom Usado' : '1 Cupom de Bebida Válido'}
                            </div>

                            {/* Instructions */}
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                              <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
                              <p className="text-xs text-orange-900 dark:text-orange-100">
                                <strong>Como usar:</strong> Apresente esta tela no bar após participar do evento.
                                Cupom válido por até 3 dias após o evento.
                              </p>
                            </div>
                          </div>
                        </div>
                      </LiquidGlassCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom spacing for navigation */}
      <div className="h-24 md:h-0" />
    </div>
  );
}
