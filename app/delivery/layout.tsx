"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/lib/auth/hooks';
import { supabase } from '@/lib/supabase';
import { CompleteProfileModal } from '@/components/auth/CompleteProfileModal';

export default function DeliveryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useUser();
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        async function checkProfile() {
            if (!user) return;

            // Verificar se perfil existe e está completo
            // Primeiro checar se tabela profiles existe (para não quebrar se migration não rodou)
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('whatsapp')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    // Ignora erro se tabela não existir ou erro de conexão
                    console.log('Profile check skipped/failed', error.message);
                    return;
                }

                // Se não tem perfil ou não tem whatsapp -> Mostrar modal
                // Nota: Trigger cria perfil, mas whatsapp vem nulo
                if (!profile || !profile.whatsapp) {
                    setShowProfileModal(true);
                }
            } catch (err) {
                console.error('Error checking profile:', err);
            }
        }

        checkProfile();
    }, [user]);

    return (
        <div className="lg:pb-0">
            {children}

            <CompleteProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                onSuccess={() => setShowProfileModal(false)}
            />
        </div>
    );
}
