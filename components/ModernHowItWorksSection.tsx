"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Sparkles, Gift, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const steps = [
  {
    number: 1,
    icon: PartyPopper,
    title: "Escolha o Evento",
    description: "Explore eventos por data e tipo. Veja quais bebidas estão disponíveis em cada lugar",
  },
  {
    number: 2,
    icon: CheckCircle2,
    title: "Confirme Presença",
    description: "Faça login ou cadastre-se em segundos e confirme presença para garantir seu cupom",
  },
  {
    number: 3,
    icon: Gift,
    title: "Ganhe Cupom",
    description: "Seus cupons ficam salvos na sua conta. Use no evento para economizar nas bebidas 🍺",
  },
];

export function ModernHowItWorksSection() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section id="como-funciona" className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 backdrop-blur-md border border-orange-300 dark:border-orange-700 shadow-lg">
            <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-300" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Simples e Rápido</span>
          </div>

          <h2 className="font-baloo2 text-4xl md:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
              Como Funciona?
            </span>
          </h2>

          <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl mx-auto">
            Apenas 3 passos simples para confirmar presença e ganhar cupons de desconto
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative px-4 md:px-16">
            {/* Navigation Buttons - Modern style */}
            <button
              onClick={prevStep}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={nextStep}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 group"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Card - Modern glass morphism */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="relative rounded-3xl p-8 md:p-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-orange-200/20 dark:border-orange-800/20 shadow-2xl overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-pink-50/50 dark:from-orange-950/30 dark:via-transparent dark:to-pink-950/30 pointer-events-none" />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    {/* Icon Side */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {/* Number badge */}
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-baloo2 text-xl font-bold text-white shadow-lg z-10">
                          {steps[currentStep].number}
                        </div>
                        
                        {/* Icon container */}
                        <motion.div
                          initial={{ rotate: -10 }}
                          animate={{ rotate: 0 }}
                          transition={{ duration: 0.5 }}
                          className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-2xl"
                        >
                          {(() => {
                            const Icon = steps[currentStep].icon;
                            return <Icon className="w-14 h-14 md:w-16 md:h-16 text-white" strokeWidth={2} />;
                          })()}
                        </motion.div>
                      </div>
                    </div>

                    {/* Text Side */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="font-baloo2 text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent"
                      >
                        {steps[currentStep].title}
                      </motion.h3>

                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        {steps[currentStep].description}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress indicators - Elegant dots at bottom */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  index === currentStep 
                    ? "w-8 h-1.5 bg-gradient-to-r from-orange-500 to-pink-500" 
                    : "w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/login-modern"
            aria-label="Criar sua conta agora"
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "px-8 py-4 min-h-[52px] rounded-full",
              "bg-gradient-to-r from-orange-500 to-pink-500",
              "text-white font-baloo2 font-bold text-base sm:text-lg",
              "shadow-xl hover:shadow-2xl",
              "hover:scale-105 active:scale-95",
              "transition-all duration-300"
            )}
          >
            Crie sua Conta Agora
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
