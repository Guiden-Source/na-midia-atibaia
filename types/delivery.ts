export interface DeliveryProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    promotional_price?: number;
    image_url?: string;
    category_id: string;
    is_active: boolean;
    is_featured: boolean;
    stock: number;
    category?: { name: string };
    created_at?: string;
    updated_at?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    order_index: number;
}
