"use client";

import { Sparkles, CheckCircle, Gift } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: Sparkles,
        title: "Explore Eventos",
        description: "Descubra eventos incríveis acontecendo em Atibaia",
        color: "from-purple-500 to-pink-500",
        bgColor: "from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20",
    },
    {
        icon: CheckCircle,
        title: "Confirme Presença",
        description: "Garanta sua vaga em um clique, é rápido e gratuito",
        color: "from-blue-500 to-cyan-500",
        bgColor: "from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
        icon: Gift,
        title: "Ganhe Cupons",
        description: "Receba cupons de bebida grátis para usar nos eventos",
        color: "from-orange-500 to-pink-500",
        bgColor: "from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20",
    },
];

export function HowItWorksSection() {
    return (
        <section id="como-funciona" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center space-y-4 mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 shadow-lg"
                    >
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">Como Funciona</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-baloo2 text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
                    >
                        É Simples e Rápido
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Em apenas 3 passos você já está aproveitando os melhores eventos e ganhando cupons
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative group"
                            >
                                {/* Connector Line (Desktop only) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700 dark:to-transparent" />
                                )}

                                <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-baloo2 font-bold text-lg shadow-lg">
                                        {index + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className="mb-6">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.bgColor}`}>
                                            <Icon className={`w-8 h-8 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Hover Glow Effect */}
                                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <a
                        href="/#eventos"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-baloo2 font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                        <Sparkles className="w-5 h-5" />
                        Começar Agora
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
