import Link from 'next/link';

export default function FAQPage() {
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
            Perguntas Frequentes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Encontre respostas para as dúvidas mais comuns sobre o Na Mídia
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-start">
                <span className="text-orange-600 dark:text-orange-400 mr-3 text-2xl flex-shrink-0">
                  Q{index + 1}.
                </span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300 ml-12 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Ainda tem dúvidas?</h2>
          <p className="text-white/90 mb-6 text-lg">
            Entre em contato conosco no Instagram! Nossa equipe está pronta para ajudar você.
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
            @namidia.atibaia
          </a>
        </div>
      </div>
    </div>
  );
}
