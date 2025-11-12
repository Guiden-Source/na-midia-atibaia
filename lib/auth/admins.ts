/**
 * Configuração centralizada de administradores da plataforma
 * 
 * Este arquivo centraliza a lista de emails autorizados como administradores
 * para evitar duplicação e facilitar manutenção.
 */

export const ADMIN_EMAILS = [
  'guidjvb@gmail.com',
  'admin@namidia.com.br',
] as const;

/**
 * Verifica se um email pertence a um administrador
 * @param email - Email do usuário a verificar
 * @returns true se o email está na lista de admins
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email as typeof ADMIN_EMAILS[number]);
}

/**
 * Verifica se um usuário é admin baseado no objeto user do Supabase
 * @param user - Objeto user do Supabase
 * @returns true se o usuário é admin
 */
export function isUserAdmin(user: { email?: string } | null): boolean {
  return isAdmin(user?.email);
}
