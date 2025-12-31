"use client";

import { HelpCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const faqs = [
    {
        question: "Como posso criar uma conta?",
        answer: "Simples! Clique em qualquer botão 'Entrar com Google' e pronto. Sua conta é criada automaticamente usando seu email do Google. Sem necessidade de senha ou cadastros longos.",
    },
    {
        question: "Como funciona o sistema de cupons?",
        answer: "Ao confirmar presença em um evento, você ganha automaticamente um cupom de bebida para usar no bar do evento. O cupom fica salvo na sua conta e pode ser resgatado apresentando seu celular.",
    },
    {
        question: "Os eventos são gratuitos?",
        answer: "A confirmação de presença é 100% gratuita! Você não paga nada para garantir sua vaga e ganhar cupons. Os eventos podem ter entrada paga ou gratuita - isso depende de cada organizador.",
    },
];

export function FeaturedFAQs() {
    return (
        <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 shadow-lg"
                    >
                        <HelpCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">Dúvidas?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-baloo2 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Perguntas Frequentes
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Já tem dúvidas? Aqui tem as respostas
                    </motion.p>
                </div>

                {/* FAQs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="h-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Question */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 flex items-center justify-center">
                                        <HelpCircle className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                        {faq.question}
                                    </h3>
                                </div>

                                {/* Answer */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Link to Full FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <Link
                        href="/faq"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-orange-500 text-orange-700 dark:text-orange-400 font-baloo2 font-semibold hover:bg-white dark:hover:bg-gray-800 hover:scale-105 transition-all shadow-md hover:shadow-lg"
                    >
                        Ver todas as perguntas
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
