'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProductForm, ProductFormData } from '@/components/delivery/products/ProductForm';
import { toast } from 'react-hot-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function NewProductPage() {
    const router = useRouter();
    const supabase = createClient();
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const { data, error } = await supabase
            .from('delivery_categories')
            .select('*')
            .order('name');

        if (error) {
            toast.error('Erro ao carregar categorias');
            console.error(error);
        } else {
            setCategories(data || []);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (formData: ProductFormData) => {
        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            promotional_price: formData.promotional_price ? parseFloat(formData.promotional_price) : null,
            category_id: formData.category_id,
            image_url: formData.image_url || null,
            is_active: formData.is_active,
            is_featured: formData.is_featured,
            stock: formData.stock,
        };

        const { error } = await supabase
            .from('delivery_products')
            .insert([productData]);

        if (error) {
            console.error('Error creating product:', error);
            toast.error('Erro ao criar produto');
            throw error;
        }

        toast.success('Produto criado com sucesso!');
        router.push('/admin/produtos');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <AdminHeader
                title="Novo Produto"
                description="Adicione um novo item ao cardápio"
            />

            <ProductForm
                categories={categories}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
