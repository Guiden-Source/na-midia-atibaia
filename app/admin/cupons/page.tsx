"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CouponManager } from "@/components/admin/CouponManager";

export default function AdminCouponsPage() {
    const [adminEmail, setAdminEmail] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setAdminEmail(user.email);
            }
            setLoading(false);
        };
        getUser();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <AdminHeader
                title="Cupons de Desconto"
                description="Crie e gerencie cupons promocionais para delivery"
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <CouponManager adminEmail={adminEmail} />
            </div>
        </div>
    );
}
