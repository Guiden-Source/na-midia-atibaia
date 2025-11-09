import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isLive(startIso: string, endIso?: string | null): boolean {
  try {
    const now = new Date();
    const start = new Date(startIso);

    // Validação: data inválida
    if (isNaN(start.getTime())) return false;

    const end = endIso ? new Date(endIso) : null;
    if (end && isNaN(end.getTime())) return false;

    if (!end) return now >= start; // se não houver fim, considera live após início
    return now >= start && now <= end;
  } catch {
    return false;
  }
}

export function upcomingWithinHours(startIso: string, hours = 6): boolean {
  try {
    const now = new Date();
    const start = new Date(startIso);

    if (isNaN(start.getTime())) return false;

    const diff = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diff >= 0 && diff <= hours;
  } catch {
    return false;
  }
}

export function formatTimeRange(startIso: string, endIso?: string | null): string {
  try {
    const start = new Date(startIso);
    if (isNaN(start.getTime())) return "Data inválida";

    const end = endIso ? new Date(endIso) : null;
    if (end && isNaN(end.getTime())) return "Data inválida";

    const pad = (n: number) => String(n).padStart(2, "0");
    const s = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
    const e = end ? `${pad(end.getHours())}:${pad(end.getMinutes())}` : undefined;
    const date = start.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    return e ? `${date} • ${s} – ${e}` : `${date} • ${s}`;
  } catch {
    return "Data inválida";
  }
}

export function generateCouponCode(prefix = "NAMIDIA15"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  // MELHORIA: adicionar timestamp para reduzir colisões
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);

  // Gerar 4 caracteres aleatórios (em vez de 6) + timestamp
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return `${prefix}-${code}${timestamp}`;
}
