"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorFallbackProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHomeLink?: boolean;
}

export function ErrorFallback({
    title = "Ops! Algo deu errado",
    message = "Estamos preparando os melhores produtos para você. Por favor, tente novamente em alguns momentos.",
    onRetry,
    showHomeLink = true,
}: ErrorFallbackProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-orange-500" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h2 className="font-baloo2 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-baloo2 font-semibold hover:from-orange-600 hover:to-pink-600 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Tentar Novamente
                        </button>
                    )}

                    {showHomeLink && (
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-baloo2 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg"
                        >
                            <Home className="w-4 h-4" />
                            Voltar para Home
                        </Link>
                    )}
                </div>

                {/* Support hint */}
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    Se o problema persistir, entre em contato pelo{" "}
                    <a
                        href="https://www.instagram.com/namidia.atibaia/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
                    >
                        @namidia.atibaia
                    </a>
                </p>
            </div>
        </div>
    );
}
