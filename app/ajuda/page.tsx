"use client";
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export default function AjudaPage() {
  const helpTopics = [
    {
      icon: "👤",
      title: "Conta e Perfil",
      description: "Aprenda a criar e gerenciar sua conta no Na Mídia",
      topics: [
        "Como criar uma conta",
        "Editar informações do perfil",
        "Alterar senha",
        "Recuperar acesso"
      ]
    },
    {
      icon: "🎉",
      title: "Eventos",
      description: "Tudo sobre como participar e gerenciar eventos",
      topics: [
        "Buscar eventos disponíveis",
        "Confirmar presença",
        "Cancelar confirmação",
        "Compartilhar eventos"
      ]
    },
    {
      icon: "🎫",
      title: "Cupons",
      description: "Como usar cupons e aproveitar benefícios exclusivos",
      topics: [
        "Resgatar cupons",
        "Onde encontrar cupons",
        "Validade dos cupons",
        "Cupons especiais"
      ]
    },
    {
      icon: "🔔",
      title: "Notificações",
      description: "Configure alertas para não perder nenhum evento",
      topics: [
        "Ativar notificações",
        "Tipos de alertas",
        "Gerenciar preferências",
        "Notificações push"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-20 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
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
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-baloo2 text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400">
                Central de Ajuda
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Encontre ajuda sobre como usar o Na Mídia e aproveitar ao máximo a plataforma
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {helpTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LiquidGlass className="p-6 h-full hover:scale-[1.02] transition-transform" intensity={0.3}>
                <div className="text-4xl mb-4">{topic.icon}</div>
                <h3 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {topic.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {topic.description}
                </p>
                <ul className="space-y-2">
                  {topic.topics.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                      <span className="text-orange-600 dark:text-orange-400 mr-2 font-bold">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </LiquidGlass>
            </motion.div>
          ))}
        </div>

        {/* Guia Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <LiquidGlass className="p-8" intensity={0.3}>
            <h2 className="font-baloo2 text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              🚀 Guia Rápido de Uso
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-orange-600 pl-6 py-2">
                <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-2">
                  1. Crie sua conta
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Acesse o botão "Entrar" no menu e faça seu cadastro. É rápido e gratuito!
                </p>
              </div>

              <div className="border-l-4 border-pink-600 pl-6 py-2">
                <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-2">
                  2. Explore os eventos
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Navegue pela lista de eventos disponíveis em Atibaia. Use os filtros para encontrar exatamente o que procura.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6 py-2">
                <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-2">
                  3. Confirme sua presença
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Encontrou um evento interessante? Clique em "Confirmar Presença" e garanta sua vaga!
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-6 py-2">
                <h3 className="font-baloo2 text-xl font-bold text-gray-900 dark:text-white mb-2">
                  4. Compartilhe com amigos
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Use o botão de compartilhamento para convidar seus amigos para os eventos.
                </p>
              </div>
            </div>
          </LiquidGlass>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LiquidGlass className="p-8 text-center bg-gradient-to-r from-orange-500/10 to-pink-500/10" intensity={0.4}>
            <div className="mb-4">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-xl">
                <HelpCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="font-baloo2 text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Precisa de mais ajuda?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
              Nossa equipe está disponível no Instagram para responder suas dúvidas e fornecer suporte personalizado. Entre em contato agora!
            </p>
            <a
              href="https://www.instagram.com/namidia.atibaia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-baloo2 font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Instagram className="w-6 h-6" />
              Fale Conosco no Instagram
            </a>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
              @namidia.atibaia • Respondemos em até 24 horas
            </p>
          </LiquidGlass>
        </motion.div>
      </div>
    </div>
  );
}
