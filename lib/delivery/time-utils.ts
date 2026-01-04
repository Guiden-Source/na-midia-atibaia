/**
 * Utilidades relacionadas ao horário de funcionamento do delivery
 */

export interface HeroMessage {
    title: string;
    subtitle: string;
    cta: string;
    mood: 'day' | 'night';
}

/**
 * Retorna mensagem do hero baseada no horário atual
 */
export function getHeroMessage(userName: string = 'Visitante'): HeroMessage {
    const hour = new Date().getHours();

    // Horário noturno: 20h às 3h
    if (hour >= 20 || hour < 3) {
        return {
            title: `Olá, ${userName}! 🌙`,
            subtitle: 'Peça itens de mercado e bebidas em até 30 minutos, até 3h da manhã',
            cta: 'Peça seu copão de gin, whisky e cervejas geladas até 3h',
            mood: 'night'
        };
    }

    // Horário diurno: 6h às 20h
    return {
        title: `Olá, ${userName}! ☀️`,
        subtitle: 'Peça itens de mercado e bebidas em até 30 minutos',
        cta: 'Resolva o mercado sem sair de casa',
        mood: 'day'
    };
}

/**
 * Verifica se o delivery está aberto
 * Horário: 6h às 3h (fecha das 3h às 6h)
 */
export function isDeliveryOpen(): boolean {
    const hour = new Date().getHours();
    return hour < 3 || hour >= 6;
}

/**
 * Verifica se pode vender bebidas alcoólicas
 * Restrição legal: 8h às 3h
 */
export function canSellAlcohol(): boolean {
    const hour = new Date().getHours();
    return hour >= 8 && hour < 3;
}

/**
 * Retorna horário de fechamento formatado
 */
export function getClosingTime(): string {
    return '3h da manhã';
}

/**
 * Retorna horário de abertura formatado
 */
export function getOpeningTime(): string {
    return '6h da manhã';
}
