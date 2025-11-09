"use client";

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface MediaUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove: () => void;
  accept?: 'image' | 'video' | 'both';
  label?: string;
}

export function MediaUpload({ 
  value, 
  onChange, 
  onRemove, 
  accept = 'both',
  label = 'Mídia do Evento'
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = {
    image: 'image/webp,image/jpeg,image/jpg,image/png',
    video: 'video/mp4,video/webm',
    both: 'image/webp,image/jpeg,image/jpg,image/png,video/mp4,video/webm'
  };

  const isVideo = (url: string) => {
    return url?.includes('.mp4') || url?.includes('.webm') || url?.includes('video');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máx 50MB para vídeo, 5MB para imagem)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Arquivo muito grande! Máximo: ${file.type.startsWith('video/') ? '50MB' : '5MB'}`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const supabase = createClient();

      // Verificar se usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Você precisa estar logado para fazer upload');
        return;
      }

      console.log('Usuário autenticado:', user.email);

      // Gerar nome único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      console.log('Fazendo upload para:', filePath);

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from('event-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        alert(`Erro ao fazer upload: ${error.message}`);
        return;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('event-media')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      const supabase = createClient();
      
      // Extrair o caminho do arquivo da URL
      const url = new URL(value);
      const path = url.pathname.split('/').slice(-2).join('/'); // events/filename.ext

      // Deletar do Supabase Storage
      await supabase.storage
        .from('event-media')
        .remove([path]);

      onRemove();
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      onRemove(); // Remove da UI mesmo se falhar no servidor
    }
  };

  return (
    <div className="space-y-3">
      <label className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
        {accept === 'video' ? <Video className="h-4 w-4 text-primary" /> : <ImageIcon className="h-4 w-4 text-primary" />}
        {label}
        <span className="text-xs font-normal text-gray-600 dark:text-gray-400">
          {accept === 'image' && '(WebP, JPG, PNG - máx 5MB)'}
          {accept === 'video' && '(MP4, WebM - máx 50MB)'}
          {accept === 'both' && '(Imagem: 5MB | Vídeo: 50MB)'}
        </span>
      </label>

      {!value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptTypes[accept]}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fazendo upload... {uploadProgress}%
              </p>
              <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clique para fazer upload
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {accept === 'image' && 'Arraste uma imagem ou clique para selecionar'}
                  {accept === 'video' && 'Arraste um vídeo ou clique para selecionar'}
                  {accept === 'both' && 'Arraste uma imagem/vídeo ou clique para selecionar'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-black">
          {isVideo(value) ? (
            <video
              src={value}
              className="w-full h-full object-cover"
              controls
              muted
              loop
            />
          ) : (
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
          )}
          
          <button
            onClick={handleRemove}
            type="button"
            className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
            {isVideo(value) ? '🎥 Vídeo' : '🖼️ Imagem'}
          </div>
        </div>
      )}
    </div>
  );
}
