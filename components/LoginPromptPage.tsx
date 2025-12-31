"use client";

import { Gift, Sparkles, CheckCircle, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LoginPromptPageProps {
    title?: string;
    message?: string;
    benefits?: string[];
    redirectUrl?: string;
}

export function LoginPromptPage({
    title = "Faça login para ver seus cupons",
    message = "Confirme presença em eventos e ganhe cupons de bebida grátis!",
    benefits = [
        "Cupons de bebida em eventos",
        "Confirmação de presença rápida",
        "Notificações de novos eventos",
    ],
    redirectUrl = "/cupons",
}: LoginPromptPageProps) {
    const loginUrl = `/login?redirect=${encodeURIComponent(redirectUrl)}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Logo */}
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/logotiponamidiavetorizado.svg"
                            alt="Na Mídia"
                            width={160}
                            height={60}
                            className="h-12 w-auto mx-auto"
                        />
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 flex items-center justify-center">
                                <Lock className="w-10 h-10 text-orange-500" />
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center space-y-3">
                        <h1 className="font-baloo2 text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/10 dark:to-pink-900/10 border border-orange-200/50 dark:border-orange-800/50"
                            >
                                <div className="flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-orange-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {benefit}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <a
                        href={loginUrl}
                        className="block w-full py-4 px-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-baloo2 font-bold text-lg text-center hover:from-orange-600 hover:to-pink-600 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Entrar com Google
                        </span>
                    </a>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/50">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-medium text-green-900 dark:text-green-100">
                            Login seguro com Google
                        </span>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
                    >
                        ← Voltar para home
                    </Link>
                </div>
            </div>
        </div>
    );
}
