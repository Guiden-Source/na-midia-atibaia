"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/lib/supabase/client';
import type { Event } from '@/lib/types';
import { formatTimeRange } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Ticket, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Activity,
  Database,
  Image as ImageIcon,
  Link as LinkIcon,
  Download,
  Trash2,
  Sparkles
} from 'lucide-react';
import { StatsCharts } from '@/components/admin/StatsCharts';

type AdminEvent = Event & { confirmations_count: number };

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  activeEvents: number;
  totalConfirmations: number;
  totalCoupons: number;
  usedCoupons: number;
  conversionRate: number;
  usageRate: number;
}

interface HealthCheck {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface UserData {
  email: string;
  name: string;
  created_at: string;
  confirmations_count: number;
  coupons_count: number;
  coupons_used: number;
}

interface CouponData {
  id: string;
  code: string;
  user_email: string;
  user_name: string;
  event_name: string;
  event_id: string;
  created_at: string;
  used_at: string | null;
  is_used: boolean;
}

interface WeeklyData {
  week: string;
  couponsGenerated: number;
  couponsUsed: number;
  usersCreated: number;
}

// Lista de emails autorizados como admin
const ADMIN_EMAILS = [
  'guidjvb@gmail.com',
  'admin@namidia.com.br',
  // Adicione mais emails de admin aqui
];

export default function AdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    activeEvents: 0,
    totalConfirmations: 0,
    totalCoupons: 0,
    usedCoupons: 0,
    conversionRate: 0,
    usageRate: 0,
  });
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [showEventsList, setShowEventsList] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [showCouponsList, setShowCouponsList] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [resetingCouponId, setResetingCouponId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    // Verificar autorização ANTES de carregar dados
    const checkAuth = async () => {
      const supabaseClient = createClient();
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      console.log('🔐 Admin - Auth check:', {
        user: user?.email,
        isAdmin: user?.email ? ADMIN_EMAILS.includes(user.email) : false
      });
      
      if (!user || authError) {
        console.error('🔐 Admin - Not logged in, redirecting to login');
        router.push('/login?error=Por favor, faça login para acessar esta página');
        return;
      }
      
      if (!ADMIN_EMAILS.includes(user.email || '')) {
        console.error('🔐 Admin - User not authorized:', user.email);
        router.push('/?error=Você não tem permissão para acessar esta página');
        return;
      }
      
      console.log('✅ Admin - User authorized:', user.email);
      setIsAuthorized(true);
      load();
    };
    
    checkAuth();
    
    // Real-time updates apenas se autorizado
    const channel = supabase.channel('admin-events').on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'events' },
      () => { if (isAuthorized) load(false); }
    ).on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'confirmations' },
      () => { if (isAuthorized) load(false); }
    );
    
    if (isAuthorized) {
      channel.subscribe();
    }
    
    return () => { 
      channel.unsubscribe().then(() => {
        supabase.removeChannel(channel);
      });
    };
  }, [isAuthorized, router]);

  async function loadStats() {
    try {
      // Buscar total de usuários registrados via API
      let totalUsers = 0;
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const { users } = await response.json();
          totalUsers = users?.length || 0;
        }
      } catch (e) {
        console.error('Erro ao buscar usuários para stats:', e);
      }
      
      // Buscar eventos
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, is_active');
      
      // Buscar confirmações
      const { count: confirmationsCount } = await supabase
        .from('confirmations')
        .select('*', { count: 'exact', head: true });
      
      // Buscar cupons
      const { data: couponsData } = await supabase
        .from('coupons')
        .select('id, used_at');
      
      const totalCoupons = couponsData?.length || 0;
      const usedCoupons = couponsData?.filter(c => c.used_at)?.length || 0;
      
      setStats({
        totalUsers,
        totalEvents: eventsData?.length || 0,
        activeEvents: eventsData?.filter(e => e.is_active)?.length || 0,
        totalConfirmations: confirmationsCount || 0,
        totalCoupons,
        usedCoupons,
        conversionRate: confirmationsCount ? (totalCoupons / confirmationsCount) * 100 : 0,
        usageRate: totalCoupons ? (usedCoupons / totalCoupons) * 100 : 0,
      });
      
      console.log('📊 Admin - Stats loaded:', {
        users: totalUsers,
        events: eventsData?.length,
        confirmations: confirmationsCount,
        coupons: totalCoupons,
      });
    } catch (e: any) {
      console.error('📊 Admin - Error loading stats:', e);
    }
  }

  async function runHealthChecks() {
    const checks: HealthCheck[] = [];
    
    try {
      // 1. Testar conexão com Supabase
      const { error: connError } = await supabase.from('events').select('id').limit(1);
      if (connError) {
        checks.push({
          status: 'error',
          message: 'Conexão com banco de dados',
          details: connError.message
        });
      } else {
        checks.push({
          status: 'healthy',
          message: 'Conexão com banco de dados',
          details: 'OK'
        });
      }
      
      // 2. Verificar eventos sem imagem
      const { data: eventsWithoutImage } = await supabase
        .from('events')
        .select('id, name')
        .or('image_url.is.null,image_url.eq.');
      
      if (eventsWithoutImage && eventsWithoutImage.length > 0) {
        checks.push({
          status: 'warning',
          message: `${eventsWithoutImage.length} evento(s) sem imagem`,
          details: eventsWithoutImage.map(e => e.name).slice(0, 3).join(', ')
        });
      } else {
        checks.push({
          status: 'healthy',
          message: 'Imagens dos eventos',
          details: 'Todos eventos têm imagem'
        });
      }
      
      // 3. Verificar cupons órfãos (sem evento ou confirmação)
      const { data: orphanCoupons } = await supabase
        .from('coupons')
        .select('id, event_id, confirmation_id')
        .or('event_id.is.null,confirmation_id.is.null');
      
      if (orphanCoupons && orphanCoupons.length > 0) {
        checks.push({
          status: 'error',
          message: `${orphanCoupons.length} cupom(ns) órfão(s)`,
          details: 'Cupons sem evento ou confirmação associada'
        });
      } else {
        checks.push({
          status: 'healthy',
          message: 'Integridade dos cupons',
          details: 'OK'
        });
      }
      
      // 4. Verificar confirmações sem email
      const { data: confirmationsWithoutEmail } = await supabase
        .from('confirmations')
        .select('id')
        .or('user_email.is.null,user_email.eq.');
      
      if (confirmationsWithoutEmail && confirmationsWithoutEmail.length > 0) {
        checks.push({
          status: 'warning',
          message: `${confirmationsWithoutEmail.length} confirmação(ões) sem email`,
          details: 'Dados de usuário incompletos'
        });
      } else {
        checks.push({
          status: 'healthy',
          message: 'Dados de confirmações',
          details: 'Todas com email'
        });
      }
      
      // 5. Verificar cupons sem email
      const { data: couponsWithoutEmail } = await supabase
        .from('coupons')
        .select('id')
        .or('user_email.is.null,user_email.eq.');
      
      if (couponsWithoutEmail && couponsWithoutEmail.length > 0) {
        checks.push({
          status: 'error',
          message: `${couponsWithoutEmail.length} cupom(ns) sem email`,
          details: 'Impossível rastrear proprietário'
        });
      } else {
        checks.push({
          status: 'healthy',
          message: 'Dados de cupons',
          details: 'Todos com email'
        });
      }
      
    } catch (e: any) {
      checks.push({
        status: 'error',
        message: 'Erro ao executar health checks',
        details: e.message
      });
    }
    
    setHealthChecks(checks);
    console.log('🏥 Admin - Health checks completed:', checks);
  }

  async function load(showLoading = true) {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: false });
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setEvents([]);
        return;
      }

      // OTIMIZAÇÃO: buscar todas confirmações de uma vez
      const eventIds = data.map((e) => e.id);
      const { data: confirmCounts } = await supabase
        .from('confirmations')
        .select('event_id')
        .in('event_id', eventIds);

      const countMap = new Map<string, number>();
      confirmCounts?.forEach((c) => {
        countMap.set(c.event_id, (countMap.get(c.event_id) || 0) + 1);
      });

      const list: AdminEvent[] = data.map((ev) => ({
        ...(ev as any),
        confirmations_count: countMap.get(ev.id) || 0,
      }));
      
      setEvents(list);
      
      // Carregar estatísticas, health checks, usuários, cupons e dados semanais
      await Promise.all([
        loadStats(),
        runHealthChecks(),
        loadUsers(),
        loadCoupons(),
        loadWeeklyData(),
      ]);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      // Buscar usuários registrados via API
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        console.error('❌ Erro ao buscar usuários:', await response.text());
        return;
      }
      
      const { users: authUsers } = await response.json();
      
      if (!authUsers) {
        console.error('❌ Nenhum usuário retornado da API');
        return;
      }
      
      // Buscar todas as confirmações
      const { data: confirmations } = await supabase
        .from('confirmations')
        .select('user_email, created_at');
      
      // Buscar todos os cupons
      const { data: couponsData } = await supabase
        .from('coupons')
        .select('user_email, used_at');
      
      // Criar mapa de atividades por email
      const confirmationsMap = new Map<string, number>();
      const couponsMap = new Map<string, { total: number; used: number }>();
      
      confirmations?.forEach(conf => {
        const email = conf.user_email;
        if (!email) return;
        confirmationsMap.set(email, (confirmationsMap.get(email) || 0) + 1);
      });
      
      couponsData?.forEach(coupon => {
        const email = coupon.user_email;
        if (!email) return;
        
        const current = couponsMap.get(email) || { total: 0, used: 0 };
        current.total++;
        if (coupon.used_at) current.used++;
        couponsMap.set(email, current);
      });
      
      // Mapear usuários com suas atividades
      const usersList: UserData[] = (authUsers || []).map((user: any) => {
        const email = user.email || '';
        const coupons = couponsMap.get(email) || { total: 0, used: 0 };
        
        return {
          email,
          name: user.full_name || 'Sem nome',
          created_at: user.created_at,
          confirmations_count: confirmationsMap.get(email) || 0,
          coupons_count: coupons.total,
          coupons_used: coupons.used,
        };
      }).sort((a: UserData, b: UserData) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setUsers(usersList);
      console.log('👥 Admin - Users loaded:', usersList.length);
    } catch (e: any) {
      console.error('👥 Admin - Error loading users:', e);
    }
  }

  async function loadCoupons() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select(`
          id,
          code,
          user_email,
          created_at,
          used_at,
          is_used,
          event:events(id, name),
          confirmation:confirmations(user_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const couponsList: CouponData[] = (data || []).map((c: any) => ({
        id: c.id,
        code: c.code,
        user_email: c.user_email || 'Sem email',
        user_name: c.confirmation?.user_name || 'Usuário desconhecido',
        event_name: c.event?.name || 'Evento desconhecido',
        event_id: c.event?.id || '',
        created_at: c.created_at,
        used_at: c.used_at,
        is_used: c.is_used || !!c.used_at,
      }));
      
      setCoupons(couponsList);
      console.log('🎫 Admin - Coupons loaded:', couponsList.length);
    } catch (e: any) {
      console.error('🎫 Admin - Error loading coupons:', e);
    }
  }

  async function handleResetCoupon(couponId: string) {
    const coupon = coupons.find(c => c.id === couponId);
    if (!confirm(`Resetar cupom ${coupon?.code}?\n\nIsso vai marcar o cupom como não usado, permitindo que o usuário use novamente.`)) {
      return;
    }
    
    setResetingCouponId(couponId);
    
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ 
          used_at: null,
          is_used: false 
        })
        .eq('id', couponId);
      
      if (error) throw error;
      
      // Atualizar lista local
      setCoupons(prev => prev.map(c => 
        c.id === couponId 
          ? { ...c, used_at: null, is_used: false }
          : c
      ));
      
      // Recarregar stats
      await loadStats();
      
      alert('✅ Cupom resetado com sucesso!');
    } catch (e: any) {
      alert(`❌ Erro ao resetar cupom: ${e.message}`);
    } finally {
      setResetingCouponId(null);
    }
  }

  async function handleDeleteUser(email: string) {
    const user = users.find(u => u.email === email);
    if (!confirm(`⚠️ ATENÇÃO: Deletar usuário ${email}?\n\nEsta ação irá remover PERMANENTEMENTE:\n• Todas as ${user?.confirmations_count} confirmações\n• Todos os ${user?.coupons_count} cupons\n• Todos dados associados\n\n⛔ ESTA AÇÃO NÃO PODE SER DESFEITA!`)) {
      return;
    }
    
    if (!confirm(`🚨 ÚLTIMA CONFIRMAÇÃO\n\nTem certeza ABSOLUTA que deseja deletar o usuário ${email} e TODOS seus dados?\n\nDigite OK mentalmente para confirmar.`)) {
      return;
    }
    
    setDeletingUserId(email);
    
    try {
      // Deletar cupons primeiro (dependência)
      const { error: couponsError } = await supabase
        .from('coupons')
        .delete()
        .eq('user_email', email);
      
      if (couponsError) throw couponsError;
      
      // Depois deletar confirmações
      const { error: confirmationsError } = await supabase
        .from('confirmations')
        .delete()
        .eq('user_email', email);
      
      if (confirmationsError) throw confirmationsError;
      
      // Recarregar todos os dados
      await Promise.all([
        loadUsers(),
        loadCoupons(),
        loadStats(),
      ]);
      
      alert(`✅ Usuário ${email} deletado com sucesso!\n\nForam removidos:\n• ${user?.confirmations_count} confirmações\n• ${user?.coupons_count} cupons`);
    } catch (e: any) {
      alert(`❌ Erro ao deletar usuário: ${e.message}`);
    } finally {
      setDeletingUserId(null);
    }
  }

  async function handleCleanupExpiredCoupons(eventId: string) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    // Validar que o evento já terminou
    if (!event.end_time || new Date(event.end_time) > new Date()) {
      alert('⚠️ Este evento ainda não terminou!\n\nSó é possível limpar cupons de eventos que já aconteceram.');
      return;
    }
    
    try {
      // Contar cupons não usados
      const { data: unusedCoupons, count } = await supabase
        .from('coupons')
        .select('*', { count: 'exact' })
        .eq('event_id', eventId)
        .is('used_at', null);
      
      if (!count || count === 0) {
        alert('ℹ️ Não há cupons não usados para este evento.');
        return;
      }
      
      if (!confirm(`🧹 Limpar cupons não usados?\n\nEvento: ${event.name}\nCupons não usados: ${count}\n\nEstes cupons serão PERMANENTEMENTE deletados.`)) {
        return;
      }
      
      // Deletar cupons não usados
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('event_id', eventId)
        .is('used_at', null);
      
      if (error) throw error;
      
      // Recarregar dados
      await Promise.all([
        loadCoupons(),
        loadStats(),
      ]);
      
      alert(`✅ ${count} cupom(ns) removido(s) com sucesso!`);
    } catch (e: any) {
      alert(`❌ Erro ao limpar cupons: ${e.message}`);
    }
  }

  function exportUsersToCSV() {
    if (users.length === 0) {
      alert('ℹ️ Não há usuários para exportar.');
      return;
    }
    
    // Criar CSV
    const headers = ['Email', 'Nome', 'Data Cadastro', 'Confirmações', 'Cupons Gerados', 'Cupons Usados'];
    const rows = users.map(u => [
      u.email,
      `"${u.name}"`, // Aspas para nomes com vírgula
      new Date(u.created_at).toLocaleDateString('pt-BR'),
      u.confirmations_count,
      u.coupons_count,
      u.coupons_used,
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usuarios-namidia-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    console.log('📥 Admin - CSV exported:', users.length, 'users');
  }

  async function loadWeeklyData() {
    try {
      // Buscar todos cupons com datas
      const { data: allCoupons } = await supabase
        .from('coupons')
        .select('created_at, used_at')
        .order('created_at', { ascending: true });
      
      // Buscar todas confirmações para contar usuários únicos
      const { data: allConfirmations } = await supabase
        .from('confirmations')
        .select('created_at, user_email')
        .order('created_at', { ascending: true });
      
      // Função auxiliar para obter string da semana
      const getWeekString = (dateString: string) => {
        const date = new Date(dateString);
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `${date.getFullYear()}-S${weekNumber.toString().padStart(2, '0')}`;
      };
      
      // Agrupar cupons por semana
      const weekMap = new Map<string, WeeklyData>();
      
      allCoupons?.forEach(coupon => {
        const week = getWeekString(coupon.created_at);
        if (!weekMap.has(week)) {
          weekMap.set(week, { week, couponsGenerated: 0, couponsUsed: 0, usersCreated: 0 });
        }
        const data = weekMap.get(week)!;
        data.couponsGenerated++;
        if (coupon.used_at) data.couponsUsed++;
      });
      
      // Contar usuários únicos por semana
      const userWeeks = new Map<string, Set<string>>();
      allConfirmations?.forEach(conf => {
        if (!conf.user_email) return;
        const week = getWeekString(conf.created_at);
        if (!userWeeks.has(week)) {
          userWeeks.set(week, new Set());
        }
        userWeeks.get(week)!.add(conf.user_email);
      });
      
      // Adicionar contagem de usuários
      userWeeks.forEach((emails, week) => {
        if (weekMap.has(week)) {
          weekMap.get(week)!.usersCreated = emails.size;
        } else {
          weekMap.set(week, { week, couponsGenerated: 0, couponsUsed: 0, usersCreated: emails.size });
        }
      });
      
      // Converter para array e ordenar
      const weeklyArray = Array.from(weekMap.values()).sort((a, b) => a.week.localeCompare(b.week));
      
      // Pegar últimas 8 semanas
      const recentWeeks = weeklyArray.slice(-8);
      
      setWeeklyData(recentWeeks);
      console.log('📊 Admin - Weekly data loaded:', recentWeeks.length, 'weeks');
    } catch (e: any) {
      console.error('📊 Admin - Error loading weekly data:', e);
    }
  }

  async function handleDelete(id: string) {
    const eventName = events.find(e => e.id === id)?.name || 'este evento';
    if (!confirm(`Excluir "${eventName}"? Esta ação não pode ser desfeita e removerá todas as confirmações e cupons associados.`)) return;
    
    setDeletingId(id);
    setError(null);
    
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      
      // Remover da lista localmente (otimistic update)
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e: any) {
      setError(`Erro ao deletar: ${e?.message || 'Erro desconhecido'}`);
      // Recarregar para garantir consistência
      await load(false);
    } finally {
      setDeletingId(null);
    }
  }

  // Mostrar loading enquanto verifica autorização
  if (!isAuthorized && loading) {
    return (
      <main className="container py-8 pt-24 md:pt-28">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verificando permissões...</p>
          </div>
        </div>
      </main>
    );
  }

  // Não renderizar nada se não autorizado (já redirecionou)
  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="container py-8 pt-24 md:pt-28">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-baloo2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">Visão geral e gerenciamento da plataforma</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link 
            href="/validar-cupom" 
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            📱 Validar QR Code
          </Link>
          <Link 
            href="/admin/analytics" 
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            📊 Analytics
          </Link>
          <Link 
            href="/admin/criar" 
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            + Criar Evento
          </Link>
          <button 
            onClick={() => load()} 
            className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 font-baloo2 font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Usuários */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Total</span>
          </div>
          <p className="text-4xl font-bold mb-1">{stats.totalUsers}</p>
          <p className="text-sm opacity-90">Usuários cadastrados</p>
        </div>

        {/* Eventos */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Eventos</span>
          </div>
          <p className="text-4xl font-bold mb-1">{stats.activeEvents}/{stats.totalEvents}</p>
          <p className="text-sm opacity-90">Ativos / Total</p>
        </div>

        {/* Confirmações */}
        <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Engajamento</span>
          </div>
          <p className="text-4xl font-bold mb-1">{stats.totalConfirmations}</p>
          <p className="text-sm opacity-90">Confirmações de presença</p>
        </div>

        {/* Cupons */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Ticket className="h-8 w-8 opacity-80" />
            <span className="text-sm font-medium opacity-80">Cupons</span>
          </div>
          <p className="text-4xl font-bold mb-1">{stats.usedCoupons}/{stats.totalCoupons}</p>
          <p className="text-sm opacity-90">Usados / Gerados</p>
        </div>
      </div>

      {/* Métricas Secundárias */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Taxa de Conversão */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">Taxa de Conversão</h3>
              <p className="text-sm text-muted-foreground">Confirmações → Cupons</p>
            </div>
          </div>
          <p className="text-5xl font-bold text-blue-500 mb-2">{stats.conversionRate.toFixed(1)}%</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Taxa de Uso de Cupons */}
        <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-orange-500/10 p-3">
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-baloo2 text-lg font-bold text-gray-900 dark:text-white">Taxa de Uso</h3>
              <p className="text-sm text-muted-foreground">Cupons usados vs gerados</p>
            </div>
          </div>
          <p className="text-5xl font-bold text-orange-500 mb-2">{stats.usageRate.toFixed(1)}%</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.usageRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Health Checks */}
      <div className="mb-8">
        <h2 className="font-baloo2 text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Status da Plataforma
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthChecks.map((check, idx) => (
            <div 
              key={idx}
              className={`rounded-xl border-2 p-4 ${
                check.status === 'healthy' 
                  ? 'border-green-500 bg-green-500/5' 
                  : check.status === 'warning'
                  ? 'border-yellow-500 bg-yellow-500/5'
                  : 'border-red-500 bg-red-500/5'
              }`}
            >
              <div className="flex items-start gap-3">
                {check.status === 'healthy' && <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />}
                {check.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                {check.status === 'error' && <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{check.message}</p>
                  {check.details && (
                    <p className="text-sm text-muted-foreground mt-1">{check.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas Semanais (Gráficos) */}
      <div className="mb-8">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="w-full rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 text-left font-baloo2 font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between mb-4"
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            📊 Estatísticas Semanais (Últimas 8 semanas)
          </span>
          <span className="text-2xl">{showCharts ? '−' : '+'}</span>
        </button>
        
        {showCharts && <StatsCharts weeklyData={weeklyData} />}
      </div>

      {/* Toggle Lista de Eventos */}
      <div className="mb-4">
        <button
          onClick={() => setShowEventsList(!showEventsList)}
          className="w-full rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 text-left font-baloo2 font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gerenciar Eventos ({events.length})
          </span>
          <span className="text-2xl">{showEventsList ? '−' : '+'}</span>
        </button>
      </div>

      {/* Lista de Eventos (colapsável) */}
      {showEventsList && (
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando eventos...</p>
            </div>
          )}
          {error && (
            <div className="p-8 text-center">
              <p className="text-destructive font-semibold">{error}</p>
            </div>
          )}
          {!loading && !error && events.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-500 dark:text-gray-400" />
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">Nenhum evento cadastrado ainda.</p>
              <Link 
                href="/admin/criar" 
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-baloo2 font-bold text-white hover:scale-105 transition-transform"
              >
                + Criar primeiro evento
              </Link>
            </div>
          )}
          {!loading && !error && events.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Nome</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Data / Horário</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Local</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Confirmações</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Status</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">{ev.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{formatTimeRange(ev.start_time, ev.end_time)}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{ev.location}</td>
                    <td className="py-3 px-4 font-bold text-primary">{ev.confirmations_count}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ev.is_active ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                        {ev.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end flex-wrap">
                        <Link 
                          href={`/admin/editar/${ev.id}`} 
                          className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                          Editar
                        </Link>
                        <Link 
                          href={`/admin/evento/${ev.id}/cupons`} 
                          className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                          Cupons
                        </Link>
                        {ev.end_time && new Date(ev.end_time) < new Date() && (
                          <button
                            onClick={() => handleCleanupExpiredCoupons(ev.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                          >
                            <Sparkles className="h-3 w-3" />
                            Limpar
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ev.id)}
                          disabled={deletingId === ev.id}
                          className="inline-flex items-center rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
                        >
                          {deletingId === ev.id ? '...' : 'Deletar'}
                        </button>
                        <Link 
                          href={`/evento/${ev.id}`} 
                          className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
                        >
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      )}

      {/* Gerenciar Usuários */}
      <div className="mb-4">
        <button
          onClick={() => setShowUsersList(!showUsersList)}
          className="w-full rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 text-left font-baloo2 font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciar Usuários ({users.length})
          </span>
          <span className="text-2xl">{showUsersList ? '−' : '+'}</span>
        </button>
      </div>

      {showUsersList && (
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                placeholder="Buscar por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none"
              />
              <button
                onClick={exportUsersToCSV}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg hover:scale-105 transition-transform"
              >
                <Download className="h-5 w-5" />
                Exportar CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Email</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Nome</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Cadastro</th>
                  <th className="py-3 px-4 text-center font-semibold text-foreground">Confirmações</th>
                  <th className="py-3 px-4 text-center font-semibold text-foreground">Cupons</th>
                  <th className="py-3 px-4 text-center font-semibold text-foreground">Usados</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users
                  .filter(user => 
                    searchTerm === '' || 
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(user => (
                    <tr key={user.email} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-foreground">{user.email}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{user.name}</td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-green-600 dark:text-green-400">
                        {user.confirmations_count}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-primary">
                        {user.coupons_count}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.coupons_used > 0 ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {user.coupons_used}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.email)}
                          disabled={deletingUserId === user.email}
                          className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {deletingUserId === user.email ? '...' : (
                            <>
                              <Trash2 className="h-3 w-3" />
                              Deletar
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gerenciar Cupons */}
      <div className="mb-4">
        <button
          onClick={() => setShowCouponsList(!showCouponsList)}
          className="w-full rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 text-left font-baloo2 font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Gerenciar Cupons ({coupons.length})
          </span>
          <span className="text-2xl">{showCouponsList ? '−' : '+'}</span>
        </button>
      </div>

      {showCouponsList && (
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Código</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Usuário</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Email</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Evento</th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground">Criado</th>
                  <th className="py-3 px-4 text-center font-semibold text-foreground">Status</th>
                  <th className="py-3 px-4 text-right font-semibold text-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {coupons.map(coupon => (
                  <tr key={coupon.id} className={`hover:bg-muted/30 transition-colors ${coupon.is_used ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-primary">{coupon.code}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{coupon.user_name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-700 dark:text-gray-300">{coupon.user_email}</td>
                    <td className="py-3 px-4 text-foreground">
                      <Link 
                        href={`/evento/${coupon.event_id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {coupon.event_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {new Date(coupon.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {coupon.is_used ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Usado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                          <Activity className="h-3 w-3" />
                          Disponível
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        {coupon.is_used && (
                          <button
                            onClick={() => handleResetCoupon(coupon.id)}
                            disabled={resetingCouponId === coupon.id}
                            className="inline-flex items-center rounded-md bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-500 hover:bg-orange-500/20 transition-colors disabled:opacity-50"
                          >
                            {resetingCouponId === coupon.id ? '...' : '🔄 Resetar'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
