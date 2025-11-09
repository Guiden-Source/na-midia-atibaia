"use client";

import { useState } from 'react';
import { Share2, Check, Instagram, Twitter, Facebook, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Web Share API (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        toast.success('Compartilhado com sucesso!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error);
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Copiar link
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar link');
    }
  };

  // Compartilhar no WhatsApp
  const shareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${text}\n\n${url}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Compartilhar no Instagram (abre o Instagram)
  const shareInstagram = () => {
    // Instagram não tem API de compartilhamento web, então copiamos o link
    copyToClipboard();
    toast('Link copiado! Cole na bio ou stories do Instagram 📸', { icon: '📋' });
  };

  // Compartilhar no Twitter
  const shareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  // Compartilhar no Facebook
  const shareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  return (
    <div className="relative">
      {/* Botão Principal */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
      >
        <Share2 className="h-5 w-5" />
        Compartilhar
      </button>

      {/* Menu de compartilhamento (desktop) */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 z-50 w-64 p-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
            <div className="space-y-2">
              {/* WhatsApp */}
              <button
                onClick={shareWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
                  💬
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                  WhatsApp
                </span>
              </button>

              {/* Instagram */}
              <button
                onClick={shareInstagram}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                  Instagram
                </span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareFacebook}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Facebook
                </span>
              </button>

              {/* Twitter */}
              <button
                onClick={shareTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  Twitter
                </span>
              </button>

              {/* Copiar Link */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                  {copied ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <Link2 className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  {copied ? 'Copiado!' : 'Copiar Link'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
