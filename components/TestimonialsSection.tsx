"use client";

import Marquee from "./ui/marquee";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Silva",
    username: "@carlossilva",
    body: "Já fui em 5 eventos através do Na Mídia. Economizei mais de R$40 nos cupons de desconto. Vale muito a pena!",
    img: "https://avatar.vercel.sh/carlos",
  },
  {
    name: "Ana Paula",
    username: "@anapaulaa",
    body: "Adoro ver a lista de drinks antes de decidir qual evento ir. Super prático e sempre descubro festas legais em Atibaia!",
    img: "https://avatar.vercel.sh/ana",
  },
  {
    name: "Roberto Lopes",
    username: "@betolopes",
    body: "Confirmei presença em 3 eventos esse mês. Os cupons realmente funcionam e economizei bastante nas bebidas!",
    img: "https://avatar.vercel.sh/roberto",
  },
  {
    name: "Mariana Costa",
    username: "@maricosta",
    body: "Melhor forma de ficar sabendo dos eventos de Atibaia. E os cupons de desconto são a cereja do bolo!",
    img: "https://avatar.vercel.sh/mariana",
  },
  {
    name: "Felipe Santos",
    username: "@felipesantos",
    body: "O esquema dos cupons salvos na conta é ótimo. Já economizei bastante e nunca perco nenhum cupom.",
    img: "https://avatar.vercel.sh/felipe",
  },
  {
    name: "Juliana Rocha",
    username: "@jurocha",
    body: "Uso toda semana para descobrir eventos novos. Os cupons de desconto em bebidas valem muito a pena!",
    img: "https://avatar.vercel.sh/juliana",
  },
];

const TestimonialCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure className="relative w-64 cursor-pointer overflow-hidden rounded-2xl border p-4 border-gray-300 bg-white hover:shadow-xl transition-all dark:border-gray-600 dark:bg-gray-800">
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} loading="lazy" />
        <div className="flex flex-col">
          <figcaption className="text-sm font-baloo2 font-bold text-gray-900 dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-200">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-900 dark:text-gray-100 leading-relaxed">{body}</blockquote>
      <div className="mt-2 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    </figure>
  );
};

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-baloo2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
            O Que Dizem Sobre Nós
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200">
            Veja o que nossos usuários estão falando
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg">
          <Marquee pauseOnHover className="[--duration:30s]">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.username} {...testimonial} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-gray-950"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-gray-950"></div>
        </div>
      </div>
    </section>
  );
}
