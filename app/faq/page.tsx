"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Como posso criar uma conta no Na Mídia?",
      answer: "Clique no botão 'Entrar' no menu superior e selecione a opção de criar uma nova conta. Você pode se cadastrar com e-mail ou usar suas redes sociais."
    },
    {
      question: "Como faço para confirmar presença em um evento?",
      answer: "Acesse a página do evento desejado e clique no botão 'Confirmar Presença'. Você precisará estar logado para confirmar sua participação."
    },
    {
      question: "Os eventos são gratuitos?",
      answer: "Sim! Todos os eventos listados no Na Mídia são 100% gratuitos para a comunidade de Atibaia."
    },
    {
      question: "Como posso compartilhar um evento nas redes sociais?",
      answer: "Na página de cada evento, você encontrará um botão de compartilhamento que permite enviar o evento para WhatsApp, Instagram, Facebook, Twitter ou copiar o link."
    },
    {
      question: "Posso cancelar minha confirmação de presença?",
      answer: "Sim, você pode gerenciar suas confirmações através do seu perfil. Entre em contato conosco no Instagram se precisar de ajuda."
    },
    {
      question: "Como funciona o sistema de cupons?",
      answer: "Alguns eventos oferecem cupons especiais com benefícios exclusivos. Digite o código do cupom na página do evento para ativá-lo."
    },
    {
      question: "Posso sugerir eventos para serem publicados?",
      answer: "Sim! Entre em contato conosco através do Instagram para sugerir eventos e atividades para a comunidade de Atibaia."
    },
    {
      question: "Como faço para receber notificações de novos eventos?",
      answer: "Ative as notificações do navegador quando solicitado ou siga nosso Instagram @namidia.atibaia para ficar por dentro de todos os eventos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-20 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors mb-6 font-baloo2 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Home
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 shadow-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-baloo2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
                Perguntas Frequentes
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Encontre respostas para as dúvidas mais comuns sobre o Na Mídia
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <LiquidGlass
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-xl' : 'shadow-md'
                  }`}
                intensity={0.3}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="font-baloo2 text-orange-600 dark:text-orange-400 font-bold text-lg flex-shrink-0">
                      Q{index + 1}.
                    </span>
                    <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-16">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </LiquidGlass>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LiquidGlass className="p-8 text-center bg-gradient-to-r from-orange-500/10 to-pink-500/10" intensity={0.4}>
            <div className="mb-4">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-xl">
                <Instagram className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="font-baloo2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Ainda tem dúvidas?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
              Entre em contato conosco no Instagram! Nossa equipe está pronta para ajudar você.
            </p>
            <a
              href="https://www.instagram.com/namidia.atibaia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-baloo2 font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Instagram className="w-6 h-6" />
              @namidia.atibaia
            </a>
          </LiquidGlass>
        </motion.div>
      </div>
    </div>
  );
}
