"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Drink, EventDrink, DRINK_TYPES } from '@/lib/drinks/types';
import { ArrowLeft, Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { MediaUpload } from '@/components/admin/MediaUpload';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_time: '',
    end_time: '',
    event_type: 'Afterparty',
    na_midia_present: false,
    description: '',
    is_active: true,
    image_url: ''
  });

  // Drinks state
  const [allDrinks, setAllDrinks] = useState<Drink[]>([]);
  const [eventDrinks, setEventDrinks] = useState<EventDrink[]>([]);
  const [loadingDrinks, setLoadingDrinks] = useState(true);
  const [selectedDrinks, setSelectedDrinks] = useState<Map<string, { preco?: number; destaque: boolean }>>(new Map());

  useEffect(() => {
    loadEvent();
    loadDrinks();
  }, [eventId]);

  async function loadEvent() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Evento não encontrado');

      // Formatar datas para datetime-local input
      const startTime = data.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : '';
      const endTime = data.end_time ? new Date(data.end_time).toISOString().slice(0, 16) : '';

      setFormData({
        name: data.name || '',
        location: data.location || '',
        start_time: startTime,
        end_time: endTime,
        event_type: data.event_type || 'Afterparty',
        na_midia_present: data.na_midia_present || false,
        description: data.description || '',
        is_active: data.is_active !== false,
        image_url: data.image_url || ''
      });
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao carregar evento');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  }

  async function loadDrinks() {
    try {
      // Carregar todas as bebidas disponíveis
      const { data: drinks, error: drinksError } = await supabase
        .from('drinks')
        .select('*')
        .eq('ativo', true)
        .order('tipo')
        .order('nome');

      if (drinksError) throw drinksError;
      setAllDrinks(drinks || []);

      // Carregar bebidas vinculadas ao evento
      const { data: eventDrinksData, error: eventDrinksError } = await supabase
        .from('event_drinks')
        .select('*, drink:drinks(*)')
        .eq('event_id', eventId);

      if (eventDrinksError) throw eventDrinksError;
      setEventDrinks(eventDrinksData || []);

      // Preencher selectedDrinks
      const selected = new Map();
      eventDrinksData?.forEach((ed) => {
        selected.set(ed.drink_id, {
          preco: ed.preco_evento || undefined,
          destaque: ed.destaque
        });
      });
      setSelectedDrinks(selected);

    } catch (e: any) {
      toast.error('Erro ao carregar bebidas: ' + e.message);
    } finally {
      setLoadingDrinks(false);
    }
  }

  function toggleDrink(drinkId: string, drink: Drink) {
    const newSelected = new Map(selectedDrinks);
    if (newSelected.has(drinkId)) {
      newSelected.delete(drinkId);
    } else {
      newSelected.set(drinkId, {
        preco: drink.preco || undefined,
        destaque: false
      });
    }
    setSelectedDrinks(newSelected);
  }

  function updateDrinkPrice(drinkId: string, preco: number | undefined) {
    const newSelected = new Map(selectedDrinks);
    const current = newSelected.get(drinkId);
    if (current) {
      newSelected.set(drinkId, { ...current, preco });
      setSelectedDrinks(newSelected);
    }
  }

  function toggleDrinkDestaque(drinkId: string) {
    const newSelected = new Map(selectedDrinks);
    const current = newSelected.get(drinkId);
    if (current) {
      newSelected.set(drinkId, { ...current, destaque: !current.destaque });
      setSelectedDrinks(newSelected);
    }
  }

  async function saveDrinks() {
    try {
      // Remover todas as bebidas atuais do evento
      await supabase
        .from('event_drinks')
        .delete()
        .eq('event_id', eventId);

      // Inserir novas bebidas selecionadas
      if (selectedDrinks.size > 0) {
        const inserts = Array.from(selectedDrinks.entries()).map(([drinkId, config]) => ({
          event_id: eventId,
          drink_id: drinkId,
          disponivel: true,
          preco_evento: config.preco,
          destaque: config.destaque
        }));

        const { error } = await supabase
          .from('event_drinks')
          .insert(inserts);

        if (error) throw error;
      }

      toast.success('Bebidas atualizadas com sucesso!');
      await loadDrinks(); // Recarregar
    } catch (e: any) {
      toast.error('Erro ao salvar bebidas: ' + e.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('events')
        .update({
          name: formData.name,
          location: formData.location,
          start_time: formData.start_time,
          end_time: formData.end_time,
          event_type: formData.event_type,
          na_midia_present: formData.na_midia_present,
          description: formData.description,
          is_active: formData.is_active,
          image_url: formData.image_url || null
        })
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Evento atualizado com sucesso!');
      router.push('/admin');
    } catch (e: any) {
      toast.error(e?.message || 'Erro ao atualizar evento');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="container py-8 pt-24 md:pt-28">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-700 dark:text-gray-300 animate-pulse text-lg">⏳ Carregando evento...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8 pt-24 md:pt-28">
      <div className="mb-8">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 font-baloo2 font-semibold text-gray-900 dark:text-white transition-all hover:scale-105 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Admin
        </Link>
        <h1 className="font-righteous text-4xl text-foreground mb-2">✏️ Editar Evento</h1>
        <p className="text-gray-700 dark:text-gray-300">Atualize as informações do evento</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload de Mídia */}
          <div className="md:col-span-2">
            <MediaUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              onRemove={() => setFormData({ ...formData, image_url: '' })}
              accept="both"
              label="Imagem ou Vídeo do Evento"
            />
          </div>

          {/* Nome */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Calendar className="h-4 w-4 text-primary" />
              Nome do Evento *
            </label>
            <input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
              placeholder="Nome do evento"
            />
          </div>

          {/* Local */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <MapPin className="h-4 w-4 text-primary" />
              Local *
            </label>
            <input
              id="location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
              placeholder="Local do evento"
            />
          </div>

          {/* Data Início */}
          <div>
            <label htmlFor="start_time" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Clock className="h-4 w-4 text-primary" />
              Data e Hora de Início *
            </label>
            <input
              id="start_time"
              type="datetime-local"
              required
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label htmlFor="end_time" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <Clock className="h-4 w-4 text-primary" />
              Data e Hora de Término *
            </label>
            <input
              id="end_time"
              type="datetime-local"
              required
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Tipo de Evento */}
          <div className="md:col-span-2">
            <label htmlFor="event_type" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <FileText className="h-4 w-4 text-primary" />
              Tipo de Evento
            </label>
            <select
              id="event_type"
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
            >
              <option>Afterparty</option>
              <option>Show</option>
              <option>Baile</option>
              <option>Festival</option>
              <option>Outro</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <label className="flex items-center gap-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:scale-105 transition-transform">
              <input
                type="checkbox"
                checked={formData.na_midia_present}
                onChange={(e) => setFormData({ ...formData, na_midia_present: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              🍹 Equipe Na Mídia presente (oferece cupom de bebida)
            </label>
            <label className="flex items-center gap-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:scale-105 transition-transform">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
              />
              ✅ Evento ativo (visível no site)
            </label>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
              <FileText className="h-4 w-4 text-primary" />
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-32 w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
              placeholder="Descreva os detalhes do evento..."
            />
          </div>

          {/* Botão de Submit */}
          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-6 py-4 font-baloo2 font-bold text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '💾 Salvando...' : '✅ Salvar Alterações'}
            </button>
            <Link
              href="/admin"
              className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 font-baloo2 font-semibold text-gray-900 dark:text-white transition-all hover:scale-105 text-center"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>

      {/* Gestão de Bebidas */}
      <div className="mt-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-righteous text-3xl text-foreground">🍹 Bebidas do Evento</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Selecione as bebidas disponíveis e configure preços
            </p>
          </div>
          <button
            onClick={saveDrinks}
            className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-baloo2 font-bold text-white shadow-lg transition-all hover:scale-105"
          >
            💾 Salvar Bebidas
          </button>
        </div>

        {loadingDrinks ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-700 dark:text-gray-300 animate-pulse text-lg">⏳ Carregando bebidas...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(DRINK_TYPES).map(([tipo, info]) => {
              const drinksOfType = allDrinks.filter(d => d.tipo === tipo);
              if (drinksOfType.length === 0) return null;

              return (
                <div key={tipo} className="border-b pb-6 last:border-b-0">
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                    <span className="text-2xl">{info.icon}</span>
                    <span>{info.label}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-normal">
                      ({drinksOfType.filter(d => selectedDrinks.has(d.id)).length}/{drinksOfType.length})
                    </span>
                  </h3>

                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {drinksOfType.map((drink) => {
                      const isSelected = selectedDrinks.has(drink.id);
                      const config = selectedDrinks.get(drink.id);

                      return (
                        <div
                          key={drink.id}
                          className={`rounded-xl border-2 p-4 transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleDrink(drink.id, drink)}
                              className="mt-1 h-5 w-5 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-foreground">{drink.nome}</p>
                                  {drink.descricao && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {drink.descricao}
                                    </p>
                                  )}
                                </div>
                                {drink.preco && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    R$ {drink.preco.toFixed(2)}
                                  </span>
                                )}
                              </div>

                              {isSelected && (
                                <div className="mt-3 space-y-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground">
                                      Preço no evento (opcional)
                                    </label>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={config?.preco || ''}
                                      onChange={(e) => updateDrinkPrice(drink.id, e.target.value ? parseFloat(e.target.value) : undefined)}
                                      className="mt-1 w-full rounded border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                      placeholder="R$ 0,00"
                                    />
                                  </div>
                                  <label className="flex items-center gap-2 text-xs text-foreground">
                                    <input
                                      type="checkbox"
                                      checked={config?.destaque || false}
                                      onChange={() => toggleDrinkDestaque(drink.id)}
                                      className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                                    />
                                    ⭐ Bebida em destaque
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {selectedDrinks.size === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  🍺 Nenhuma bebida selecionada. Selecione bebidas para este evento.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
