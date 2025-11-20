"use client";

export function BannerCarousel() {
    return (
        <div className="py-4">
            <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x">
                {/* Banner 1 */}
                <div className="min-w-[280px] md:min-w-[320px] h-40 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white flex flex-col justify-between shadow-lg snap-center relative overflow-hidden group cursor-pointer">
                    <div className="relative z-10">
                        <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold mb-2 inline-block">
                            HOJE
                        </span>
                        <h3 className="font-bold text-xl w-2/3 leading-tight">
                            Entrega Grátis em todo o site
                        </h3>
                    </div>
                    <button className="relative z-10 bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold w-fit hover:bg-gray-50 transition-colors">
                        Aproveitar
                    </button>
                    <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        🛵
                    </div>
                </div>

                {/* Banner 2 */}
                <div className="min-w-[280px] md:min-w-[320px] h-40 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white flex flex-col justify-between shadow-lg snap-center relative overflow-hidden group cursor-pointer">
                    <div className="relative z-10">
                        <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold mb-2 inline-block">
                            NOVIDADE
                        </span>
                        <h3 className="font-bold text-xl w-2/3 leading-tight">
                            Conheça os novos parceiros
                        </h3>
                    </div>
                    <button className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-bold w-fit hover:bg-gray-50 transition-colors">
                        Ver Lista
                    </button>
                    <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        🏪
                    </div>
                </div>

                {/* Banner 3 */}
                <div className="min-w-[280px] md:min-w-[320px] h-40 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-700 p-5 text-white flex flex-col justify-between shadow-lg snap-center relative overflow-hidden group cursor-pointer">
                    <div className="relative z-10">
                        <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold mb-2 inline-block">
                            SAUDÁVEL
                        </span>
                        <h3 className="font-bold text-xl w-2/3 leading-tight">
                            Opções fit para seu almoço
                        </h3>
                    </div>
                    <button className="relative z-10 bg-white text-green-600 px-4 py-2 rounded-full text-sm font-bold w-fit hover:bg-gray-50 transition-colors">
                        Pedir Agora
                    </button>
                    <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        🥗
                    </div>
                </div>
            </div>
        </div>
    );
}
