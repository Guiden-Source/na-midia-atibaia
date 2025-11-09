"use client";

import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { Calendar, Ticket, Gift, Zap, Users, MapPin, Bell } from "lucide-react";

const features = [
  {
    title: "Eventos em Tempo Real",
    description: "Veja eventos AO VIVO acontecendo agora em Atibaia e região",
    icon: <Zap className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
    header: (
      <div className="flex h-full min-h-[6rem] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20">
        <Zap className="h-12 w-12 text-primary" />
      </div>
    ),
  },
  {
    title: "Cupons Garantidos",
    description: "100% de garantia nos cupons de bebida para todos os eventos",
    icon: <Ticket className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex h-full min-h-[6rem] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20">
        <Ticket className="h-12 w-12 text-green-600" />
      </div>
    ),
  },
  {
    title: "Confirmação Rápida",
    description: "Confirme sua presença em segundos, sem burocracia",
    icon: <Zap className="h-6 w-6 text-primary" />,
    className: "md:col-span-1",
    header: (
      <div className="flex h-full min-h-[6rem] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20">
        <Zap className="h-12 w-12 text-blue-600" />
      </div>
    ),
  },
  {
    title: "Descubra Novos Lugares",
    description: "Explore os melhores locais e estabelecimentos da cidade",
    icon: <MapPin className="h-6 w-6 text-primary" />,
    className: "md:col-span-2",
    header: (
      <div className="flex h-full min-h-[6rem] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20">
        <MapPin className="h-12 w-12 text-purple-600" />
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="mb-3 font-baloo2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            Por Que Usar o Na Mídia?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-200">
            A melhor experiência para descobrir e participar de eventos
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <BentoGridItem
              key={i}
              title={feature.title}
              description={feature.description}
              header={feature.header}
              icon={feature.icon}
              className={feature.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
