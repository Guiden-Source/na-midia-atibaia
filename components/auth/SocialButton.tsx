"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/auth/social";
import toast from "react-hot-toast";

interface SocialButtonProps {
  provider: "google" | "facebook" | "apple";
  mode?: "signin" | "signup";
}

const providerConfig = {
  google: {
    name: "Google",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    bgColor: "bg-white hover:bg-gray-50",
    textColor: "text-gray-900",
    borderColor: "border-gray-300",
  },
  facebook: {
    name: "Facebook",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    bgColor: "bg-[#1877F2] hover:bg-[#166FE5]",
    textColor: "text-white",
    borderColor: "border-[#1877F2]",
  },
  apple: {
    name: "Apple",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    ),
    bgColor: "bg-black hover:bg-gray-900",
    textColor: "text-white",
    borderColor: "border-black",
  },
};

export function SocialButton({ provider, mode = "signin" }: SocialButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = providerConfig[provider];
  const actionText = mode === "signin" ? "Entrar" : "Criar conta";

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (provider === "google") {
        await signInWithGoogle();
      }
      // Adicione outros providers aqui
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      toast.error(`Erro ao ${mode === "signin" ? "entrar" : "criar conta"} com ${config.name}`);
      setIsLoading(false);
    }
    // Não resetamos isLoading aqui porque o redirect vai acontecer
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`
        w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl
        border-2 ${config.borderColor} ${config.bgColor} ${config.textColor}
        font-semibold text-sm transition-all
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
        shadow-sm hover:shadow-md
      `}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          {config.icon}
          {actionText} com {config.name}
        </>
      )}
    </button>
  );
}

// Componente para mostrar múltiplos botões sociais
export function SocialButtons({ mode = "signin" }: { mode?: "signin" | "signup" }) {
  return (
    <div className="space-y-3">
      <SocialButton provider="google" mode={mode} />
      {/* Descomente quando configurar outros providers */}
      {/* <SocialButton provider="facebook" mode={mode} /> */}
      {/* <SocialButton provider="apple" mode={mode} /> */}
    </div>
  );
}
