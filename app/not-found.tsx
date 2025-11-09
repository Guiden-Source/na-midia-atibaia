import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logotiponamidiavetorizado.svg"
            alt="Na Mídia"
            width={200}
            height={100}
            className="h-auto w-40 drop-shadow-2xl"
            priority
          />
        </div>

        {/* 404 */}
        <h1 className="mb-6 font-baloo2 text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="mb-4 font-baloo2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Página Não Encontrada
        </h2>

        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Ops! A página que você está procurando não existe ou foi movida. Que tal voltar aos eventos?
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-baloo2 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:bg-orange-600 active:scale-95"
          >
            <Home className="h-5 w-5" />
            Ir para Home
          </Link>

          <Link
            href="/#eventos"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white/80 backdrop-blur-sm px-6 py-3 font-baloo2 text-lg font-semibold text-orange-700 transition-all hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95 dark:bg-gray-800/80 dark:text-orange-400 dark:hover:bg-gray-800"
          >
            <Search className="h-5 w-5" />
            Ver Eventos
          </Link>
        </div>

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-baloo2 font-semibold">Voltar</span>
        </button>
      </div>
    </div>
  );
}
