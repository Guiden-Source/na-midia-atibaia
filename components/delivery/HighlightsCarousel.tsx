"use client";

import { DeliveryProduct } from '@/lib/delivery/types';
import { ProductCardModern } from './ProductCardModern';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HighlightsCarouselProps {
    products: DeliveryProduct[];
    title?: string;
}

export function HighlightsCarousel({ products, title = "Destaques" }: HighlightsCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="py-4">
            <div className="flex items-center justify-between px-4 md:px-0 mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">
                    {title}
                </h2>
                <div className="hidden md:flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-0 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCardModern product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
