'use client';

import { User, LogOut } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ProfileHeaderProps {
    user: SupabaseUser | null;
    onLogout: () => void;
}

export function ProfileHeader({ user, onLogout }: ProfileHeaderProps) {
    return (
        <LiquidGlass className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="h-24 w-24 lg:h-28 lg:w-28 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-1">
                        <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-12 w-12 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center lg:text-left min-w-0">
                    <h1 className="font-baloo2 text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Olá, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Visitante'}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 truncate">{user?.email}</p>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2 shrink-0"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </button>
            </div>
        </LiquidGlass>
    );
}
