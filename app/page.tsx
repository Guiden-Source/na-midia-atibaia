"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Zap, Phone, CreditCard, Package } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData';

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-5 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32">
        <div className="mx-auto max-w-5xl">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <Image
              src="/logotiponamidiavetorizado.svg"
              alt="Na Mídia"
              width={208}
              height={104}
              className="h-auto w-28 sm:w-40 lg:w-52 drop-shadow-2xl"
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-center font-baloo2 text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-7xl">
            Delivery Rápido e Fácil <br />
            <span className="text-orange-600 dark:text-orange-400">No Seu Condomínio</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-center text-base sm:text-lg text-gray-700 dark:text-gray-200 lg:text-xl">
            Peça o que precisar direto do seu celular • Receba rapidinho no conforto da sua casa 🏠
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-3">
            <Link
              href="/delivery"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-10 py-5 min-h-[56px] font-baloo2 text-lg sm:text-xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-3xl hover:bg-orange-600 active:scale-95"
              aria-label="Fazer pedido agora"
            >
              Fazer Pedido Agora
              <ShoppingBag className="h-6 w-6 transition-transform group-hover:scale-110" />
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-orange-600 dark:text-orange-400">⚡</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Entrega Rápida</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-orange-600 dark:text-orange-400">🏠</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sem Sair de Casa</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-orange-600 dark:text-orange-400">💳</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pagamento Fácil</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-baloo2 font-bold text-orange-600 dark:text-orange-400">📱</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pelo WhatsApp</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// How It Works Section - DELIVERY FOCUSED
function HowItWorksDelivery() {
  const steps = [
    {
      number: "1",
      emoji: "🛒",
      title: "Escolha seus produtos",
      description: "Navegue pelo cardápio e adicione ao carrinho"
    },
    {
      number: "2",
      emoji: "📱",
      title: "Confirme o pedido",
      description: "Preencha seu endereço e escolha a forma de pagamento"
    },
    {
      number: "3",
      emoji: "🚀",
      title: "Receba em casa",
      description: "Seu pedido chega rapidinho no seu condomínio"
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-baloo2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            É Simples e Rápido
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200">
            Em apenas 3 passos você recebe seus produtos em casa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-baloo2 font-bold text-xl shadow-lg">
                {step.number}
              </div>

              {/* Emoji */}
              <div className="text-5xl mb-4 text-center">
                {step.emoji}
              </div>

              {/* Content */}
              <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA after steps */}
        <div className="mt-12 text-center">
          <Link
            href="/delivery"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-baloo2 font-bold hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 shadow-xl"
          >
            Começar Agora
            <Zap className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// CTA Final
function FinalCTA() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-baloo2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            Pronto para facilitar sua vida com
            <span className="text-orange-600 dark:text-orange-400"> Delivery Rápido</span>?
          </h2>

          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Junte-se a centenas de moradores que já estão aproveitando a praticidade de receber tudo em casa
          </p>

          <div className="pt-4">
            <Link
              href="/delivery"
              aria-label="Ver cardápio completo"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 px-12 py-6 min-h-[60px] font-baloo2 text-xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-3xl active:scale-95"
            >
              Ver Cardápio Completo
              <Package className="h-6 w-6 transition-transform group-hover:rotate-12" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <OrganizationSchema />
      <WebSiteSchema />

      {/* Hero Section */}
      <BlurFade delay={0} inView>
        <HeroSection />
      </BlurFade>

      {/* How It Works */}
      <BlurFade delay={0.2} inView>
        <HowItWorksDelivery />
      </BlurFade>

      {/* CTA Final */}
      <BlurFade delay={0.3} inView>
        <FinalCTA />
      </BlurFade>
    </>
  );
}
