import Link from 'next/link';

export default function PrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Última atualização: 9 de novembro de 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 space-y-8">
          
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-xl p-6 border-l-4 border-orange-600">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              <strong>Compromisso com sua privacidade:</strong> O Na Mídia está comprometido em proteger a privacidade e os dados pessoais de nossos usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Informações que Coletamos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Coletamos as seguintes informações quando você usa nossa plataforma:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              1.1 Informações Fornecidas por Você
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Informações de perfil (foto, preferências)</li>
              <li>Confirmações de presença em eventos</li>
              <li>Cupons resgatados</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              1.2 Informações Coletadas Automaticamente
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Endereço IP</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Páginas visitadas e tempo de navegação</li>
              <li>Data e hora de acesso</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Como Usamos suas Informações
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Utilizamos suas informações para:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li>Criar e gerenciar sua conta</li>
              <li>Processar confirmações de presença em eventos</li>
              <li>Enviar notificações sobre eventos e atualizações</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Melhorar nossos serviços e desenvolver novos recursos</li>
              <li>Enviar comunicações de marketing (com seu consentimento)</li>
              <li>Prevenir fraudes e garantir a segurança da plataforma</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Base Legal para Processamento
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Processamos seus dados pessoais com base em:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Consentimento:</strong> Quando você nos autoriza a processar seus dados</li>
              <li><strong>Execução de contrato:</strong> Para fornecer os serviços solicitados</li>
              <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e segurança</li>
              <li><strong>Obrigação legal:</strong> Para cumprir requisitos legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Não vendemos suas informações pessoais. Podemos compartilhar seus dados com:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Organizadores de eventos:</strong> Informações necessárias para confirmações de presença</li>
              <li><strong>Provedores de serviços:</strong> Empresas que nos ajudam a operar a plataforma (hospedagem, analytics)</li>
              <li><strong>Autoridades:</strong> Quando exigido por lei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Cookies e Tecnologias Similares
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Segurança dos Dados
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, controles de acesso e monitoramento contínuo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Retenção de Dados
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Seus Direitos (LGPD)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              De acordo com a LGPD, você tem o direito de:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
              <li><strong>Confirmação e acesso:</strong> Confirmar se processamos seus dados e acessá-los</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização ou eliminação:</strong> Solicitar a anonimização ou eliminação de dados desnecessários</li>
              <li><strong>Portabilidade:</strong> Solicitar a portabilidade de seus dados a outro fornecedor</li>
              <li><strong>Revogação do consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
              <li><strong>Revisão:</strong> Solicitar revisão de decisões automatizadas</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Para exercer seus direitos, entre em contato conosco através do Instagram.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Dados de Menores
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Nossa plataforma não é direcionada a menores de 13 anos. Não coletamos intencionalmente dados de crianças. Se você acredita que coletamos dados de uma criança, entre em contato conosco imediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Links para Sites de Terceiros
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Nossa plataforma pode conter links para sites de terceiros. Não somos responsáveis pelas práticas de privacidade desses sites. Recomendamos que você leia as políticas de privacidade de cada site que visitar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Alterações nesta Política
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas através da plataforma ou por e-mail. A data da última atualização será sempre indicada no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Encarregado de Dados (DPO)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Para questões relacionadas à proteção de dados e privacidade, você pode entrar em contato com nosso encarregado de dados através do Instagram.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              13. Contato
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Para dúvidas sobre esta Política de Privacidade ou para exercer seus direitos de proteção de dados, entre em contato conosco:
            </p>
            <a
              href="https://www.instagram.com/namidia.atibaia/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @namidia.atibaia
            </a>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
              📍 Atibaia - SP, Brasil
            </p>
          </section>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-l-4 border-blue-600 mt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              🔒 Seu Controle, Seus Dados
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              Você tem total controle sobre seus dados pessoais. Estamos comprometidos em manter sua privacidade e segurança. Se tiver qualquer dúvida ou preocupação, não hesite em entrar em contato conosco.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
