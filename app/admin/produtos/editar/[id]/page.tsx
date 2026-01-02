'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProductForm, ProductFormData } from '@/components/delivery/products/ProductForm';
import { toast } from 'react-hot-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface EditProductPageProps {
    params: {
        id: string;
    };
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const router = useRouter();
    const supabase = createClient();
    const [categories, setCategories] = useState<any[]>([]);
    const [initialData, setInitialData] = useState<ProductFormData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [params.id]);

    const loadData = async () => {
        try {
            const [categoriesRes, productRes] = await Promise.all([
                supabase.from('delivery_categories').select('*').order('name'),
                supabase.from('delivery_products').select('*').eq('id', params.id).single()
            ]);

            if (categoriesRes.error) throw categoriesRes.error;
            if (productRes.error) throw productRes.error;

            setCategories(categoriesRes.data || []);

            const product = productRes.data;
            setInitialData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                promotional_price: product.promotional_price?.toString() || '',
                category_id: product.category_id,
                image_url: product.image_url || '',
                is_active: product.is_active,
                is_featured: product.is_featured,
                stock: product.stock || 0,
            });
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Erro ao carregar dados do produto');
            router.push('/admin/produtos');
        } finally {
            setIsLoading(false);
        }
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
            .update(productData)
            .eq('id', params.id);

        if (error) {
            console.error('Error updating product:', error);
            toast.error('Erro ao atualizar produto');
            throw error;
        }

        toast.success('Produto atualizado com sucesso!');
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
                title="Editar Produto"
                description={`Editando: ${initialData?.name}`}
            />

            <ProductForm
                categories={categories}
                onSubmit={handleSubmit}
                initialData={initialData}
                isEditing={true}
            />
        </div>
    );
}
