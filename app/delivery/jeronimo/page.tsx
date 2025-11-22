import { getProducts } from '@/lib/delivery/queries';
import { JeronimoView } from './JeronimoView';

export const metadata = {
    title: 'Delivery Exclusivo - Jerônimo de Camargo | Na Mídia',
    description: 'Entrega grátis em 30 minutos para moradores do Residencial Jerônimo de Camargo.',
};

export default async function JeronimoPage() {
    // Busca produtos em destaque ou gerais
    const products = await getProducts();

    return <JeronimoView initialProducts={products} />;
}
