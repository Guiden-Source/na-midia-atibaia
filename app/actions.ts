"use server";

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { generateCouponCode } from '@/lib/utils';
import type { Event, Promotion, PromotionClaim } from '@/lib/types';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { headers } from 'next/headers';

// Helper: enviar notificação push quando criar novo evento
async function sendEventNotification(eventName: string, location: string, eventDate: string, eventUrl?: string): Promise<void> {
  try {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const restKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !restKey) {
      console.log('[OneSignal] Credenciais não configuradas, notificação ignorada');
      return;
    }

    const title = '🎉 Novo evento em Atibaia!';
    const message = `${eventName} • ${location} • ${eventDate}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${restKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: appId,
        headings: {
          pt: title,
          en: '🎉 New event in Atibaia!'
        },
        contents: {
          pt: message,
          en: message
        },
        url: eventUrl || siteUrl,
        included_segments: ['All'],
        web_push_topic: 'new-event',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('[OneSignal] Erro ao enviar notificação:', response.status, error);
    } else {
      const result = await response.json();
      console.log('✅ [OneSignal] Notificação enviada com sucesso:', result.id);
    }
  } catch (e) {
    console.warn('[OneSignal] Falha ao notificar novo evento:', e);
  }
}

export async function fetchEvents(): Promise<Event[]> {
  const supabase = createSupabaseServerClient();

  // Try filtering by is_active; if column doesn't exist, fallback to all events
  let data: any[] | null = null;
  try {
    const res = await supabase
      .from('events')
      .select(`
        *,
        event_drinks (
          id,
          disponivel,
          preco_evento,
          destaque,
          drink:drinks (
            id,
            nome,
            tipo,
            descricao,
            icone
          )
        )
      `)
      .eq('is_active', true)
      .order('start_time', { ascending: true });
    if (res.error) throw res.error;
    data = res.data;
  } catch (err: any) {
    if (String(err?.message || '').includes('is_active')) {
      const res2 = await supabase
        .from('events')
        .select(`
          *,
          event_drinks (
            id,
            disponivel,
            preco_evento,
            destaque,
            drink:drinks (
              id,
              nome,
              tipo,
              descricao,
              icone
            )
          )
        `)
        .order('start_time', { ascending: true });
      data = res2.data ?? [];
    } else {
      throw err;
    }
  }

  if (!data || data.length === 0) return [];

  // OTIMIZAÇÃO: buscar todas as confirmações de uma vez ao invés de N+1 queries
  const eventIds = data.map((e) => e.id);
  const { data: confirmCounts } = await supabase
    .from('confirmations')
    .select('event_id')
    .in('event_id', eventIds);

  const countMap = new Map<string, number>();
  confirmCounts?.forEach((c) => {
    countMap.set(c.event_id, (countMap.get(c.event_id) || 0) + 1);
  });

  return data.map((e) => ({
    ...e,
    confirmations_count: countMap.get(e.id) || 0,
  })) as Event[];
}

export async function fetchEvent(id: string): Promise<Event | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_drinks (
        id,
        disponivel,
        preco_evento,
        destaque,
        drink:drinks (
          id,
          nome,
          tipo,
          descricao,
          icone
        )
      )
    `)
    .eq('id', id)
    .single();
  if (error) return null;

  const { count } = await supabase
    .from('confirmations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id);

  return { ...(data as any), confirmations_count: count ?? 0 } as Event;
}

type ConfirmState = { ok: boolean; code?: string; error?: string };

export async function confirmPresence(
  prevState: ConfirmState,
  formData: FormData
): Promise<ConfirmState> {
  const supabase = createSupabaseServerClient();

  try {
    const event_id = String(formData.get('event_id') || '').trim();
    const user_name = String(formData.get('user_name') || '').trim();
    const user_email = String(formData.get('user_email') || '').trim();
    const user_phone = String(formData.get('user_phone') || '').trim();

    // Validação mais rigorosa
    if (!event_id || event_id.length < 10) {
      return { ok: false, error: 'ID do evento inválido' };
    }
    if (!user_name || user_name.length < 2) {
      return { ok: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }

    // SEGURANÇA: usar RPC com unique constraint ou verificar duplicação antes
    const { data: existing } = await supabase
      .from('confirmations')
      .select('id')
      .eq('event_id', event_id)
      .eq('user_name', user_name)
      .maybeSingle();

    if (existing) {
      return { ok: false, error: 'Você já confirmou presença neste evento' };
    }

    const { data: conf, error: confErr } = await supabase
      .from('confirmations')
      .insert({ event_id, user_name, user_email: user_email || null, user_phone: user_phone || null })
      .select('*')
      .single();
    if (confErr || !conf) return { ok: false, error: confErr?.message || 'Erro ao confirmar' };

    // MELHORIA: retry logic para geração de cupom único
    let attempts = 0;
    const maxAttempts = 5;
    let code = '';
    let coupErr: any = null;

    while (attempts < maxAttempts) {
      code = generateCouponCode('NAMIDIA15');
      const { error } = await supabase
        .from('coupons')
        .insert({
          code,
          event_id,
          confirmation_id: conf.id,
          discount_percentage: 15,
          is_used: false,
        });

      if (!error) {
        coupErr = null;
        break;
      }

      // Se for erro de unicidade, tenta novamente
      if (error.message?.includes('unique') || error.code === '23505') {
        attempts++;
        coupErr = error;
        continue;
      }

      // Outro tipo de erro: falha imediata
      coupErr = error;
      break;
    }

    if (coupErr) return { ok: false, error: 'Não foi possível gerar cupom. Tente novamente.' };

    return { ok: true, code };
  } catch (e: any) {
    console.error('[confirmPresence] Erro inesperado:', e);
    return { ok: false, error: e?.message || 'Erro desconhecido' };
  }
}

type CreateEventState = { ok: boolean; error?: string; id?: string };

export async function createEvent(
  prevState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  const supabase = createSupabaseServerClient();

  try {
    const name = String(formData.get('name') || '').trim();
    const location = String(formData.get('location') || '').trim();

    // Validação básica
    if (!name || name.length < 3) {
      return { ok: false, error: 'Nome do evento deve ter pelo menos 3 caracteres' };
    }
    if (!location || location.length < 3) {
      return { ok: false, error: 'Local deve ter pelo menos 3 caracteres' };
    }

    const payload = {
      name,
      location,
      description: String(formData.get('description') || '').trim(),
      start_time: String(formData.get('start_time')),
      end_time: String(formData.get('end_time')) || null,
      // Respeita o CHECK do schema: ('Afterparty','Show','Baile','Festival','Outro')
      event_type: ((): string => {
        const v = String(formData.get('event_type') || '').trim();
        const allowed = ['Afterparty', 'Show', 'Baile', 'Festival', 'Outro'];
        return allowed.includes(v) ? v : 'Afterparty';
      })(),
      is_active: true,
      // FIX: checkbox validation correta
      na_midia_present: formData.get('na_midia_present') === 'on' || formData.get('na_midia_present') === 'true',
    };

    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };

    // Best-effort: enviar notificação push (não bloqueia criação)
    const eventDate = new Date(payload.start_time).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    const eventUrl = data?.id ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/evento/${data.id}` : undefined;
    sendEventNotification(payload.name, payload.location, eventDate, eventUrl).catch(() => { });

    return { ok: true, id: data?.id };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erro desconhecido' };
  }
}

// ================================
// Sugestões compatíveis (contrato { success, data?, error? })
// Mantemos as funções existentes para compatibilidade com o app atual.
// ================================

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function fetchEventsAction(): Promise<ActionResult<Event[]>> {
  try {
    const events = await fetchEvents();
    return { success: true, data: events };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao buscar eventos' };
  }
}

export async function fetchEventById(id: string): Promise<ActionResult<Event | null>> {
  try {
    const ev = await fetchEvent(id);
    return { success: true, data: ev };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Falha ao buscar evento' };
  }
}

export type CreateEventInput = {
  name: string;
  location: string;
  description?: string;
  start_time: string;
  end_time?: string;
  event_type: 'Afterparty' | 'Show' | 'Baile' | 'Festival' | 'Outro';
  is_active?: boolean;
  na_midia_present?: boolean;
  image_url?: string | null;
};

export async function createEventAction(data: CreateEventInput): Promise<ActionResult<{ id: string }>> {
  const supabase = createSupabaseServerClient();

  try {
    const payload = {
      name: data.name,
      location: data.location,
      description: data.description ?? '',
      start_time: data.start_time,
      end_time: data.end_time ?? null,
      event_type: data.event_type,
      is_active: data.is_active ?? true,
      na_midia_present: data.na_midia_present ?? false,
      image_url: data.image_url ?? null,
    };

    const { data: inserted, error } = await supabase
      .from('events')
      .insert(payload)
      .select('id')
      .single();
    if (error || !inserted) return { success: false, error: error?.message || 'Erro ao criar evento' };

    // Notificar usuários (não bloqueante)
    const eventDate = new Date(payload.start_time).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    const eventUrl = inserted?.id ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/evento/${inserted.id}` : undefined;
    sendEventNotification(payload.name, payload.location, eventDate, eventUrl).catch(() => { });

    return { success: true, data: { id: inserted.id } };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro desconhecido' };
  }
}

export type ConfirmUserData = { name: string; email?: string; phone?: string };

export async function confirmPresenceAction(eventId: string, user: ConfirmUserData): Promise<ActionResult<{ code: string }>> {
  const supabase = createSupabaseServerClient();

  try {
    if (!eventId || !user?.name) return { success: false, error: 'Dados incompletos' };

    // Verificar se usuário está logado e obter email da sessão
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    const userEmail = authUser?.email || user.email || '';

    console.log('✅ confirmPresenceAction - Auth check:', {
      authUser: authUser?.email,
      authError: authError?.message,
      providedEmail: user.email,
      finalEmail: userEmail,
      userName: user.name,
      hasEmail: !!userEmail
    });

    // CRÍTICO: Se não tem email, retornar erro
    if (!userEmail) {
      console.error('❌ confirmPresenceAction - No email provided!');
      return {
        success: false,
        error: 'Por favor, faça login antes de confirmar presença.'
      };
    }

    // ⚠️ VERIFICAR SE USUÁRIO JÁ TEM CUPOM PARA ESTE EVENTO
    if (userEmail) {
      const { data: existingCoupon } = await supabase
        .from('coupons')
        .select('code')
        .eq('event_id', eventId)
        .eq('user_email', userEmail)
        .maybeSingle();

      if (existingCoupon) {
        console.log('⚠️ confirmPresenceAction - User already has coupon for this event:', existingCoupon.code);
        return {
          success: false,
          error: 'Você já possui um cupom para este evento! Verifique seus cupons em Perfil.'
        };
      }
    }

    // Rate limiting: max 5 confirmações por IP a cada 15 minutos
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const identifier = getRateLimitIdentifier(ip, eventId);
    const rateLimitResult = rateLimit(identifier, { maxRequests: 5, windowMs: 15 * 60 * 1000 });

    if (!rateLimitResult.success) {
      const minutesLeft = Math.ceil((rateLimitResult.resetAt - Date.now()) / 60000);
      return {
        success: false,
        error: `Muitas tentativas. Tente novamente em ${minutesLeft} minutos.`
      };
    }

    const { data: conf, error: confErr } = await supabase
      .from('confirmations')
      .insert({
        event_id: eventId,
        user_name: user.name,
        user_email: userEmail, // ← Usar email da sessão se disponível
        user_phone: user.phone || '',
      })
      .select('*')
      .single();

    if (confErr || !conf) {
      console.error('❌ confirmPresenceAction - Error creating confirmation:', confErr);
      return { success: false, error: confErr?.message || 'Erro ao confirmar' };
    }

    console.log('✅ confirmPresenceAction - Confirmation created:', conf.id);

    const code = generateCouponCode('NAMIDIA15');

    console.log('📝 confirmPresenceAction - Creating coupon with data:', {
      code,
      event_id: eventId,
      confirmation_id: conf.id,
      user_email: userEmail,
      has_user_email: !!userEmail
    });

    const { data: couponData, error: coupErr } = await supabase
      .from('coupons')
      .insert({
        code,
        event_id: eventId,
        confirmation_id: conf.id,
        user_email: userEmail, // ← CRÍTICO: user_email DEVE estar aqui!
        discount_percentage: 15,
        is_used: false,
      })
      .select()
      .single();

    if (coupErr) {
      console.error('❌ confirmPresenceAction - Error creating coupon:', coupErr);
      return { success: false, error: coupErr.message };
    }

    console.log('✅ confirmPresenceAction - Coupon created successfully:', {
      code,
      user_email: userEmail,
      coupon_id: couponData?.id
    });

    console.log('✅ confirmPresenceAction - Coupon created:', code, 'for user:', userEmail);

    return { success: true, data: { code } };
  } catch (e: any) {
    console.error('❌ confirmPresenceAction - Unexpected error:', e);
    return { success: false, error: e?.message || 'Erro desconhecido' };
  }
}

export async function validateCoupon(code: string): Promise<ActionResult<{ id: string; code: string }>> {
  const supabase = createSupabaseServerClient();

  try {
    if (!code?.trim()) return { success: false, error: 'Código inválido' };
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('coupons')
      .update({ is_used: true, used_at: now })
      .eq('code', code)
      .eq('is_used', false)
      .select('id, code')
      .single();
    if (error || !data) return { success: false, error: error?.message || 'Cupom não encontrado ou já usado' };
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro desconhecido' };
  }
}

// ================================
// Analytics & Métricas
// ================================

export type AnalyticsOverview = {
  totalEvents: number;
  totalConfirmations: number;
  totalCoupons: number;
  couponsUsed: number;
  conversionRate: number; // % de visitantes que confirmam
  couponUsageRate: number; // % de cupons que são usados
  avgConfirmationsPerEvent: number;
};

export type EventPopularity = {
  event_id: string;
  event_name: string;
  confirmations: number;
  coupons_generated: number;
  coupons_used: number;
  conversion_rate: number;
};

export type GrowthData = {
  date: string;
  events: number;
  confirmations: number;
  coupons: number;
};

export async function getAnalyticsOverview(period?: 'today' | 'week' | 'month' | 'all'): Promise<ActionResult<AnalyticsOverview>> {
  const supabase = createSupabaseServerClient();

  try {
    // Calcular data inicial baseado no período
    const now = new Date();
    let startDate: string | null = null;

    if (period === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = today.toISOString();
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = weekAgo.toISOString();
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      startDate = monthAgo.toISOString();
    }

    // Total de eventos
    let eventsQuery = supabase.from('events').select('id', { count: 'exact', head: true });
    if (startDate) eventsQuery = eventsQuery.gte('created_at', startDate);
    const { count: totalEvents } = await eventsQuery;

    // Total de confirmações
    let confirmationsQuery = supabase.from('confirmations').select('id', { count: 'exact', head: true });
    if (startDate) confirmationsQuery = confirmationsQuery.gte('created_at', startDate);
    const { count: totalConfirmations } = await confirmationsQuery;

    // Total de cupons
    let couponsQuery = supabase.from('coupons').select('id, is_used', { count: 'exact' });
    if (startDate) couponsQuery = couponsQuery.gte('created_at', startDate);
    const { data: couponsData, count: totalCoupons } = await couponsQuery;

    // Cupons usados
    const couponsUsed = couponsData?.filter(c => c.is_used).length || 0;

    // Taxas
    const conversionRate = totalEvents && totalEvents > 0
      ? ((totalConfirmations || 0) / (totalEvents * 100)) * 100 // Assumindo média de 100 visitas por evento
      : 0;

    const couponUsageRate = totalCoupons && totalCoupons > 0
      ? (couponsUsed / totalCoupons) * 100
      : 0;

    const avgConfirmationsPerEvent = totalEvents && totalEvents > 0
      ? (totalConfirmations || 0) / totalEvents
      : 0;

    return {
      success: true,
      data: {
        totalEvents: totalEvents || 0,
        totalConfirmations: totalConfirmations || 0,
        totalCoupons: totalCoupons || 0,
        couponsUsed,
        conversionRate: Math.round(conversionRate * 10) / 10,
        couponUsageRate: Math.round(couponUsageRate * 10) / 10,
        avgConfirmationsPerEvent: Math.round(avgConfirmationsPerEvent * 10) / 10,
      }
    };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao buscar analytics' };
  }
}

export async function getEventsPopularity(limit: number = 10): Promise<ActionResult<EventPopularity[]>> {
  const supabase = createSupabaseServerClient();

  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        id,
        name,
        confirmations(count),
        coupons(id, is_used)
      `)
      .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    if (!events) return { success: true, data: [] };

    const popularity: EventPopularity[] = events.map(event => {
      const confirmations = Array.isArray(event.confirmations) ? event.confirmations.length : 0;
      const coupons = Array.isArray(event.coupons) ? event.coupons : [];
      const couponsUsed = coupons.filter((c: any) => c.is_used).length;

      return {
        event_id: event.id,
        event_name: event.name,
        confirmations,
        coupons_generated: coupons.length,
        coupons_used: couponsUsed,
        conversion_rate: coupons.length > 0 ? (couponsUsed / coupons.length) * 100 : 0,
      };
    });

    // Ordenar por confirmações
    popularity.sort((a, b) => b.confirmations - a.confirmations);

    return {
      success: true,
      data: popularity.slice(0, limit)
    };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao buscar popularidade' };
  }
}

export async function getGrowthData(days: number = 7): Promise<ActionResult<GrowthData[]>> {
  const supabase = createSupabaseServerClient();

  try {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Buscar todos os dados
    const { data: events } = await supabase
      .from('events')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    const { data: confirmations } = await supabase
      .from('confirmations')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    const { data: coupons } = await supabase
      .from('coupons')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    // Agrupar por data
    const growthMap: { [date: string]: GrowthData } = {};

    // Inicializar todos os dias
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      growthMap[dateStr] = {
        date: dateStr,
        events: 0,
        confirmations: 0,
        coupons: 0,
      };
    }

    // Contar eventos por dia
    events?.forEach(e => {
      const dateStr = e.created_at.split('T')[0];
      if (growthMap[dateStr]) growthMap[dateStr].events++;
    });

    // Contar confirmações por dia
    confirmations?.forEach(c => {
      const dateStr = c.created_at.split('T')[0];
      if (growthMap[dateStr]) growthMap[dateStr].confirmations++;
    });

    // Contar cupons por dia
    coupons?.forEach(c => {
      const dateStr = c.created_at.split('T')[0];
      if (growthMap[dateStr]) growthMap[dateStr].coupons++;
    });

    const growthData = Object.values(growthMap).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      success: true,
      data: growthData
    };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao buscar dados de crescimento' };
  }
}

// ================================
// PROMOÇÕES
// ================================

/**
 * Buscar todas as promoções ativas e válidas
 */
export async function fetchPromotionsAction(): Promise<ActionResult<Promotion[]>> {
  const supabase = createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('active', true)
      .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Promotion[] };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao buscar promoções' };
  }
}

/**
 * Buscar promoções em destaque (para a homepage)
 */
export async function fetchFeaturedPromotionsAction(): Promise<ActionResult<Promotion[]>> {
  const supabase = createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('active', true)
      .eq('featured', true)
      .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(6); // Máximo 6 promoções em destaque

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Promotion[] };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao buscar promoções em destaque' };
  }
}

/**
 * Buscar uma promoção específica por ID
 */
export async function fetchPromotionById(id: string): Promise<ActionResult<Promotion | null>> {
  const supabase = createSupabaseServerClient();

  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Promotion };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao buscar promoção' };
  }
}

/**
 * Resgatar uma promoção (chamar função RPC do Supabase)
 */
export async function claimPromotionAction(promotionId: string): Promise<ActionResult<{ code: string; message: string }>> {
  const supabase = createSupabaseServerClient();

  try {
    // Verificar se usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Você precisa estar logado para resgatar promoções' };
    }

    // Chamar função RPC do Supabase
    const { data, error } = await supabase
      .rpc('claim_promotion', { p_promotion_id: promotionId });

    if (error) return { success: false, error: error.message };

    // Parsear resultado JSON da função
    const result = typeof data === 'string' ? JSON.parse(data) : data;

    if (!result.success) {
      return { success: false, error: result.error || 'Erro ao resgatar promoção' };
    }

    return {
      success: true,
      data: {
        code: result.code,
        message: `Promoção resgatada! Código: ${result.code}`
      }
    };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao resgatar promoção' };
  }
}

/**
 * Buscar cupons resgatados do usuário logado
 */
export async function fetchUserPromotionClaims(): Promise<ActionResult<(PromotionClaim & { promotion: Promotion })[]>> {
  const supabase = createSupabaseServerClient();

  try {
    // Verificar se usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Você precisa estar logado' };
    }

    const { data, error } = await supabase
      .from('promotion_claims')
      .select(`
        *,
        promotion:promotions(*)
      `)
      .eq('user_id', user.id)
      .order('claimed_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as any };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Erro ao buscar cupons' };
  }
}
