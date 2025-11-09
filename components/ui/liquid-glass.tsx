"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /**
   * Intensity of the glass effect (0-1)
   * @default 0.5
   */
  intensity?: number;
  /**
   * Enable hover effect
   * @default true
   */
  hover?: boolean;
  /**
   * Border radius
   * @default "lg"
   */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

export function LiquidGlass({
  children,
  className,
  intensity = 0.5,
  hover = true,
  rounded = "lg",
  ...props
}: LiquidGlassProps) {
  const blurValue = Math.round(intensity * 20);
  const bgOpacity = Math.round(intensity * 20);

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "backdrop-blur-md",
        roundedClasses[rounded],
        "border border-white/20",
        "shadow-xl shadow-black/5",
        "transition-all duration-300",
        hover && "hover:shadow-2xl hover:shadow-black/10 hover:scale-[1.02]",
        className
      )}
      style={{
        backdropFilter: `blur(${blurValue}px)`,
        WebkitBackdropFilter: `blur(${blurValue}px)`,
      }}
      {...props}
    >
      {/* Glass effect overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, ${bgOpacity / 100}) 0%, 
            rgba(255, 255, 255, ${bgOpacity / 200}) 100%)`,
        }}
      />

      {/* Liquid effect gradient */}
      <div
        className={cn(
          "absolute inset-0 -z-10 opacity-0",
          "bg-gradient-to-br from-white/30 via-transparent to-white/10",
          "transition-opacity duration-500",
          hover && "group-hover:opacity-100"
        )}
      />

      {/* Shimmer effect */}
      <div
        className={cn(
          "absolute -inset-full -z-10",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "translate-x-[-100%]",
          hover && "group-hover:translate-x-[100%] transition-transform duration-1000"
        )}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Liquid Glass Card - Pre-styled variant for cards
 */
interface LiquidGlassCardProps extends LiquidGlassProps {
  /**
   * Enable gradient border
   * @default false
   */
  gradientBorder?: boolean;
}

export function LiquidGlassCard({
  children,
  className,
  gradientBorder = false,
  ...props
}: LiquidGlassCardProps) {
  return (
    <div className={cn("group", gradientBorder && "p-[1px] rounded-2xl bg-gradient-to-br from-orange-500/50 via-pink-500/50 to-purple-500/50")}>
      <LiquidGlass
        className={cn(
          "p-6",
          gradientBorder && "rounded-2xl",
          className
        )}
        rounded={gradientBorder ? "2xl" : "lg"}
        {...props}
      >
        {children}
      </LiquidGlass>
    </div>
  );
}

/**
 * Liquid Glass Button - Pre-styled variant for buttons
 */
interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  intensity?: number;
}

export function LiquidGlassButton({
  children,
  className,
  intensity = 0.3,
  ...props
}: LiquidGlassButtonProps) {
  const blurValue = Math.round(intensity * 20);
  const bgOpacity = Math.round(intensity * 20);

  return (
    <button
      className={cn(
        "group relative overflow-hidden",
        "px-6 py-3 rounded-full",
        "backdrop-blur-md",
        "border border-white/20",
        "shadow-lg shadow-black/5",
        "transition-all duration-300",
        "hover:shadow-xl hover:shadow-black/10 hover:scale-105",
        "active:scale-95",
        "font-baloo2 font-semibold",
        className
      )}
      style={{
        backdropFilter: `blur(${blurValue}px)`,
        WebkitBackdropFilter: `blur(${blurValue}px)`,
      }}
      {...props}
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, ${bgOpacity / 100}) 0%, 
            rgba(255, 255, 255, ${bgOpacity / 200}) 100%)`,
        }}
      />

      {/* Shimmer on hover */}
      <div
        className={cn(
          "absolute -inset-full -z-10",
          "bg-gradient-to-r from-transparent via-white/30 to-transparent",
          "translate-x-[-100%]",
          "group-hover:translate-x-[100%] transition-transform duration-700"
        )}
      />

      <span className="relative z-10">{children}</span>
    </button>
  );
}
