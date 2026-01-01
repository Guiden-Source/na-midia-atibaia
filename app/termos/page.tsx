import Link from 'next/link';

export default function TermosPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400">
            Termos de Uso
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Última atualização: 9 de novembro de 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Ao acessar e usar o Na Mídia, você aceita e concorda em cumprir estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não use nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              O Na Mídia é uma plataforma digital gratuita que conecta a comunidade de Atibaia com eventos, atividades e experiências locais. Nossos serviços incluem:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Divulgação de eventos gratuitos em Atibaia</li>
              <li>Sistema de confirmação de presença</li>
              <li>Compartilhamento de eventos em redes sociais</li>
              <li>Sistema de cupons e benefícios exclusivos</li>
              <li>Notificações sobre novos eventos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Cadastro e Conta de Usuário
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Para usar alguns recursos da plataforma, você precisa criar uma conta. Ao criar uma conta, você concorda em:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
              <li>Manter a segurança de sua senha</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Uso Aceitável
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Você concorda em não usar a plataforma para:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Publicar conteúdo ofensivo, difamatório ou ilegal</li>
              <li>Interferir no funcionamento da plataforma</li>
              <li>Tentar obter acesso não autorizado a sistemas ou dados</li>
              <li>Usar a plataforma para fins comerciais sem autorização</li>
              <li>Fazer spam ou enviar conteúdo não solicitado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Conteúdo e Propriedade Intelectual
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, imagens e software, é propriedade do Na Mídia ou de seus licenciadores e está protegido por leis de direitos autorais e propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Eventos e Confirmações
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              O Na Mídia atua como intermediário na divulgação de eventos. Não somos responsáveis pela organização, realização ou cancelamento dos eventos. A confirmação de presença não garante entrada em eventos com capacidade limitada.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Cupons e Promoções
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Cupons e promoções estão sujeitos a termos específicos e disponibilidade. Reservamo-nos o direito de modificar ou cancelar cupons a qualquer momento. Os cupons não podem ser trocados por dinheiro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              O Na Mídia não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou impossibilidade de uso da plataforma. A plataforma é fornecida "como está" sem garantias de qualquer tipo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Modificações dos Termos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Rescisão
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Podemos suspender ou encerrar sua conta e acesso à plataforma a qualquer momento, sem aviso prévio, por violação destes termos ou por qualquer outro motivo a nosso exclusivo critério.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Lei Aplicável
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais da Comarca de Atibaia, São Paulo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Contato
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do nosso Instagram:
            </p>
            <a
              href="https://www.instagram.com/namidia.atibaia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @namidia.atibaia
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}
