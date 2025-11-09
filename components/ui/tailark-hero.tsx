"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Users, Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { LiquidGlassButton } from "./liquid-glass";
import { cn } from "@/lib/utils";

export function TailarkHeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated background elements */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Plataforma #1 de Eventos em Atibaia</span>
            </motion.div>

            {/* Main heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-baloo2 text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Descubra Eventos
                </span>
                <br />
                <span className="text-foreground">Incríveis em Atibaia</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl"
              >
                Conecte-se aos melhores eventos da cidade. Confirme presença com um clique e ganhe cupons exclusivos de bebidas. 🍺
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/#eventos">
                <LiquidGlassButton
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 text-lg px-8"
                >
                  <span className="flex items-center gap-2">
                    Ver Eventos
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </LiquidGlassButton>
              </Link>

              <Link href="/#como-funciona">
                <LiquidGlassButton className="text-lg px-8">
                  Como Funciona
                </LiquidGlassButton>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              <StatCard
                icon={<Users className="w-6 h-6 text-orange-500" />}
                value="5K+"
                label="Usuários"
              />
              <StatCard
                icon={<Calendar className="w-6 h-6 text-pink-500" />}
                value="200+"
                label="Eventos"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                value="98%"
                label="Satisfação"
              />
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 relative"
          >
            {/* Main card with glassmorphism */}
            <div className="relative">
              {/* Floating cards */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-8 -left-8 z-20"
              >
                <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400" />
                    <div>
                      <p className="font-semibold text-sm">Show de Rock</p>
                      <p className="text-xs text-muted-foreground">Hoje às 20h</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-8 -right-8 z-20"
              >
                <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-2xl p-4 shadow-2xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🍺</div>
                    <div>
                      <p className="font-semibold text-sm">Cupom Grátis</p>
                      <p className="text-xs text-muted-foreground">Ganhe agora!</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Center image/visual */}
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="relative backdrop-blur-md bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-white/20 shadow-2xl p-8 flex items-center justify-center">
                  <Image
                    src="/logotiponamidiavetorizado.svg"
                    alt="Na Mídia"
                    width={300}
                    height={100}
                    className="w-full h-auto opacity-80"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Role para ver mais</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-muted-foreground/50"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-white/20 shadow-lg">
      <div className="flex flex-col items-center text-center gap-2">
        {icon}
        <div>
          <p className="font-baloo2 text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
