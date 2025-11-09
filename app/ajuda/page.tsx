import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Central de Ajuda
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Encontre ajuda sobre como usar o Na Mídia e aproveitar ao máximo a plataforma
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {helpTopics.map((topic, index) => (
            <div 
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {topic.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {topic.description}
              </p>
              <ul className="space-y-2">
                {topic.topics.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                    <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Guia Rápido */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🚀 Guia Rápido de Uso
          </h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-orange-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                1. Crie sua conta
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Acesse o botão "Entrar" no menu e faça seu cadastro. É rápido e gratuito!
              </p>
            </div>

            <div className="border-l-4 border-pink-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                2. Explore os eventos
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Navegue pela lista de eventos disponíveis em Atibaia. Use os filtros para encontrar exatamente o que procura.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                3. Confirme sua presença
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Encontrou um evento interessante? Clique em "Confirmar Presença" e garanta sua vaga!
              </p>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                4. Compartilhe com amigos
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Use o botão de compartilhamento para convidar seus amigos para os eventos.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3">Precisa de mais ajuda?</h2>
          <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
            Nossa equipe está disponível no Instagram para responder suas dúvidas e fornecer suporte personalizado. Entre em contato agora!
          </p>
          <a
            href="https://www.instagram.com/namidia.atibaia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Fale Conosco no Instagram
          </a>
          <p className="text-white/70 mt-4 text-sm">
            @namidia.atibaia • Respondemos em até 24 horas
          </p>
        </div>
      </div>
    </div>
  );
}
