"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, FileText } from 'lucide-react';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function CreateEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_time: '',
    end_time: '',
    event_type: 'Show',
    description: '',
    na_midia_present: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name.trim()) {
      toast.error('❌ Nome do evento é obrigatório');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('❌ Local do evento é obrigatório');
      return;
    }

    if (!formData.start_time) {
      toast.error('❌ Data de início é obrigatória');
      return;
    }

    if (!formData.end_time) {
      toast.error('❌ Data de término é obrigatória');
      return;
    }

    const startDate = new Date(formData.start_time);
    const endDate = new Date(formData.end_time);

    if (endDate <= startDate) {
      toast.error('❌ A data de término deve ser após a data de início');
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...formData,
          image_url: mediaUrl || null,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('✅ Evento criado com sucesso!');
      router.push('/admin');
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <AdminHeader
        title="Criar Novo Evento"
        description="Preencha os dados para criar um novo evento na plataforma"
      />

      <div className="max-w-4xl mx-auto">
        <LiquidGlass className="p-6 sm:p-8" intensity={0.3}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload de Mídia */}
            <div>
              <MediaUpload
                value={mediaUrl}
                onChange={setMediaUrl}
                onRemove={() => setMediaUrl('')}
                accept="both"
                label="Imagem ou Vídeo do Evento"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Nome */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <Calendar className="h-4 w-4 text-primary" />
                  Nome do Evento *
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Festival de Verão 2025"
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Local */}
              <div className="md:col-span-2">
                <label htmlFor="location" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <MapPin className="h-4 w-4 text-primary" />
                  Local *
                </label>
                <input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Praça Central de Atibaia"
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Data Início */}
              <div>
                <label htmlFor="start_time" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <Clock className="h-4 w-4 text-primary" />
                  Data e Hora de Início *
                </label>
                <input
                  required
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Data Fim */}
              <div>
                <label htmlFor="end_time" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <Clock className="h-4 w-4 text-primary" />
                  Data e Hora de Término *
                </label>
                <input
                  required
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Tipo de Evento */}
              <div className="md:col-span-2">
                <label htmlFor="event_type" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <FileText className="h-4 w-4 text-primary" />
                  Tipo de Evento
                </label>
                <select
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

              {/* Checkbox  */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:scale-[1.02] transition-transform">
                  <input
                    type="checkbox"
                    checked={formData.na_midia_present}
                    onChange={(e) => setFormData({ ...formData, na_midia_present: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  🍹 Equipe Na Mídia presente (oferece cupom de bebida)
                </label>
              </div>

              {/* Descrição */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                  <FileText className="h-4 w-4 text-primary" />
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva os detalhes do evento, atrações, informações importantes..."
                  className="min-h-32 w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {/* Botão Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-6 py-4 font-baloo2 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {saving ? '💾 Criando Evento...' : '✨ Criar Evento'}
                </button>
              </div>
            </div>
          </form>
        </LiquidGlass>
      </div>
    </div>
  );
}
