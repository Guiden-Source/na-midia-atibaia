"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "./actions";
import { LiquidGlass, LiquidGlassButton } from "@/components/ui/liquid-glass";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ModernLoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        if (isSignUp) {
          const result = await signUp(formData);
          if (result?.error) {
            toast.error(result.error);
          } else {
            toast.success("Conta criada! Verifique seu email.");
            setIsSignUp(false);
          }
        } else {
          const result = await signIn(formData);
          if (result?.error) {
            toast.error(result.error);
          } else {
            toast.success("Login realizado com sucesso!");
            router.push("/admin");
          }
        }
      } catch (error) {
        toast.error("Algo deu errado. Tente novamente.");
      }
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logotiponamidiavetorizado.svg"
              alt="Na Mídia"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
          </div>

          {/* Main Card */}
          <LiquidGlass
            className="p-8 space-y-6"
            intensity={0.6}
            hover={false}
            rounded="2xl"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h1 className="font-baloo2 text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {isSignUp ? "Criar Conta" : "Bem-vindo de volta"}
                </h1>
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
              <p className="text-muted-foreground">
                {isSignUp
                  ? "Crie sua conta para começar a descobrir eventos incríveis"
                  : "Entre para continuar descobrindo eventos incríveis"}
              </p>
            </div>

            {/* Form */}
            <form
              action={handleSubmit}
              className="space-y-4"
            >
              {/* Name (only on sign up) */}
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome
                  </label>
                  <LiquidGlass
                    className="p-0"
                    intensity={0.3}
                    hover={false}
                    rounded="xl"
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Seu nome completo"
                      required={isSignUp}
                      className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
                    />
                  </LiquidGlass>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <LiquidGlass
                  className="p-0"
                  intensity={0.3}
                  hover={false}
                  rounded="xl"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    required
                    className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
                  />
                </LiquidGlass>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha
                </label>
                <LiquidGlass
                  className="p-0"
                  intensity={0.3}
                  hover={false}
                  rounded="xl"
                >
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
                  />
                </LiquidGlass>
              </div>

              {/* Submit Button */}
              <LiquidGlassButton
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isSignUp ? "Criar Conta" : "Entrar"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </LiquidGlassButton>
            </form>

            {/* Toggle Sign Up/In */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"}
                {" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  {isSignUp ? "Entrar" : "Criar conta"}
                </button>
              </p>
            </div>
          </LiquidGlass>

          {/* Back to home */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar para o início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
