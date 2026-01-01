'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { CategoryManager } from '@/components/admin/CategoryManager';

export default function CategoriasPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
            <AdminHeader
                title="Gerenciar Categorias"
                description="Crie e organize as categorias do seu cardápio"
            />

            <div className="max-w-7xl mx-auto mt-6">
                <CategoryManager />
            </div>
        </div>
    );
}
