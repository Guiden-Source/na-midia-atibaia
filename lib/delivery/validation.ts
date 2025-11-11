// =====================================================
// DELIVERY SYSTEM - VALIDAÇÃO DE ENDEREÇO
// =====================================================

import { ALLOWED_CONDOMINIUMS } from './types';

/**
 * Valida se o condomínio está na lista de condomínios permitidos
 */
export function validateCondominium(condominium: string): boolean {
  return ALLOWED_CONDOMINIUMS.includes(condominium as any);
}

/**
 * Retorna mensagem de validação de entrega
 */
export function getDeliveryMessage(condominium: string): {
  isValid: boolean;
  message: string;
  icon: string;
} {
  const isValid = validateCondominium(condominium);
  
  if (isValid) {
    return {
      isValid: true,
      message: '✅ Entrega grátis em 30 minutos!',
      icon: '🚀',
    };
  }
  
  return {
    isValid: false,
    message: '❌ No momento entregamos apenas no Residencial Jeronimo de Camargo 1 e 2',
    icon: '⚠️',
  };
}

/**
 * Valida telefone brasileiro (formato simples)
 */
export function validatePhone(phone: string): boolean {
  // Remove caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Valida se tem 10 ou 11 dígitos (celular com 9)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
}

/**
 * Formata telefone para padrão brasileiro
 */
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11) {
    // (11) 99999-9999
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    // (11) 9999-9999
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Valida email (formato simples)
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida endereço completo
 */
export function validateAddress(address: {
  street: string;
  number: string;
  condominium: string;
  block?: string;
  apartment?: string;
}): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!address.street || address.street.trim().length === 0) {
    errors.push('Rua/Avenida é obrigatória');
  }
  
  if (!address.number || address.number.trim().length === 0) {
    errors.push('Número é obrigatório');
  }
  
  if (!address.condominium || address.condominium.trim().length === 0) {
    errors.push('Condomínio é obrigatório');
  } else if (!validateCondominium(address.condominium)) {
    errors.push('Condomínio não está na área de entrega');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida formulário de checkout completo
 */
export function validateCheckoutForm(data: {
  user_name: string;
  user_phone: string;
  user_email?: string;
  address_street: string;
  address_number: string;
  address_condominium: string;
  address_block?: string;
  address_apartment?: string;
  payment_method: string;
  change_for?: number;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  // Nome
  if (!data.user_name || data.user_name.trim().length < 3) {
    errors.user_name = 'Nome deve ter pelo menos 3 caracteres';
  }
  
  // Telefone
  if (!data.user_phone || !validatePhone(data.user_phone)) {
    errors.user_phone = 'Telefone inválido';
  }
  
  // Email (opcional, mas se preenchido deve ser válido)
  if (data.user_email && !validateEmail(data.user_email)) {
    errors.user_email = 'Email inválido';
  }
  
  // Endereço
  const addressValidation = validateAddress({
    street: data.address_street,
    number: data.address_number,
    condominium: data.address_condominium,
    block: data.address_block,
    apartment: data.address_apartment,
  });
  
  if (!addressValidation.isValid) {
    addressValidation.errors.forEach((error, index) => {
      errors[`address_${index}`] = error;
    });
  }
  
  // Pagamento
  if (!data.payment_method) {
    errors.payment_method = 'Forma de pagamento é obrigatória';
  }
  
  // Troco (se dinheiro)
  if (data.payment_method === 'dinheiro' && data.change_for) {
    if (data.change_for < 0) {
      errors.change_for = 'Valor do troco inválido';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
