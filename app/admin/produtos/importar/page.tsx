'use client';

import { useState } from 'react';
import { Upload, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { createClient } from '@/lib/supabase/client';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

interface CSVRow {
    nome: string;
    descricao?: string;
    preco: string;
    promocao?: string;
    categoria: string;
    ativo?: string;
    estoque?: string;
    imagem?: string;
}

export default function ImportarProdutosPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState<{ total: number; success: number; errors: string[] } | null>(null);
    const supabase = createClient();

    const processFile = async (file: File) => {
        setIsProcessing(true);
        setSummary(null);
        const errors: string[] = [];
        let successCount = 0;

        Papa.parse<CSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data;

                // Carregar e criar categorias únicas
                const { data: categories } = await supabase.from('delivery_categories').select('id, name');
                const categoryMap = new Map(categories?.map(c => [c.name.toLowerCase().trim(), c.id]));

                const uniqueCategories = new Set(rows.map(r => r.categoria?.toLowerCase().trim()).filter(Boolean));

                for (const catName of uniqueCategories) {
                    if (!categoryMap.has(catName)) {
                        const { data: newCat } = await supabase
                            .from('delivery_categories')
                            .insert({
                                name: catName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                                slug: catName.replace(/ /g, '-').replace(/[^\w-]+/g, '')
                            })
                            .select()
                            .single();

                        if (newCat) categoryMap.set(catName, newCat.id);
                    }
                }

                // Inserir produtos
                for (const [index, row] of rows.entries()) {
                    const rowNum = index + 2;

                    if (!row.nome || !row.preco || !row.categoria) {
                        errors.push(`Linha ${rowNum}: Nome, Preço e Categoria são obrigatórios.`);
                        continue;
                    }

                    const categoryId = categoryMap.get(row.categoria.toLowerCase().trim());
                    if (!categoryId) {
                        errors.push(`Linha ${rowNum}: Categoria "${row.categoria}" não encontrada`);
                        continue;
                    }

                    // Check for duplicates
                    const existingProduct = await supabase
                        .from('delivery_products')
                        .select('id')
                        .ilike('name', row.nome.trim())
                        .single();

                    if (existingProduct.data) {
                        errors.push(`Linha ${rowNum}: Produto "${row.nome}" já existe.`);
                        continue;
                    }

                    // Fix price parsing: "13,99" should be 13.99, not 1399
                    let priceStr = row.preco.replace('R$', '').trim();
                    // If it has a comma (Brazilian format), remove thousand separators and replace comma with dot
                    if (priceStr.includes(',')) {
                        priceStr = priceStr.replace(/\./g, '').replace(',', '.');
                    }
                    const price = parseFloat(priceStr);

                    let promoPrice = null;
                    if (row.promocao) {
                        let promoStr = row.promocao.replace('R$', '').trim();
                        if (promoStr.includes(',')) {
                            promoStr = promoStr.replace(/\./g, '').replace(',', '.');
                        }
                        promoPrice = parseFloat(promoStr);
                    }

                    if (isNaN(price)) {
                        errors.push(`Linha ${rowNum}: Preço inválido "${row.preco}"`);
                        continue;
                    }

                    const { error } = await supabase.from('delivery_products').insert({
                        name: row.nome.trim(),
                        description: row.descricao?.trim() || null,
                        price,
                        promotional_price: promoPrice,
                        category_id: categoryId,
                        is_active: row.ativo ? row.ativo.toLowerCase() === 'sim' : true,
                        stock: row.estoque ? parseInt(row.estoque) : null,
                        image_url: row.imagem?.trim() || null
                    });

                    if (error) {
                        errors.push(`Linha ${rowNum}: ${error.message}`);
                    } else {
                        successCount++;
                    }
                }

                if (successCount > 0) toast.success(`${successCount} produtos importados!`);
                if (errors.length > 0) toast.error(`${errors.length} erro(s) encontrado(s)`);

                setSummary({ total: rows.length, success: successCount, errors });
                setIsProcessing(false);
            },
            error: () => {
                toast.error('Erro ao ler arquivo CSV');
                setIsProcessing(false);
            }
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            processFile(file);
        } else {
            toast.error('Por favor, envie um arquivo .csv');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const downloadTemplate = () => {
        const csv = "nome,descricao,preco,promocao,categoria,ativo,estoque,imagem\nCoca Cola 2L,Refrigerante gelado,12.00,,Bebidas,sim,50,https://exemplo.com/coca.jpg\nX-Burger,Hamburguer com queijo,25.90,19.90,Lanches,sim,100,";
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'modelo_produtos.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <AdminHeader
                title="Importar Produtos em Massa"
                description="Adicione múltiplos produtos de uma vez através de arquivo CSV"
            />

            {/* Instructions */}
            <LiquidGlass className="p-6">
                <h3 className="font-bold text-lg mb-4">📋 Como Funciona</h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>1. Baixe o modelo CSV clicando no botão abaixo</li>
                    <li>2. Preencha o arquivo com seus produtos (use Excel, Google Sheets, etc.)</li>
                    <li>3. Salve como CSV e faça upload aqui</li>
                    <li>4. O sistema cria categorias automaticamente se não existirem</li>
                </ol>
            </LiquidGlass>

            {/* Upload Area */}
            <LiquidGlass className="p-8">
                {!summary ? (
                    <>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                                : 'border-gray-300 dark:border-gray-700 hover:border-orange-400'
                                }`}
                        >
                            {isProcessing ? (
                                <div className="py-12">
                                    <Loader2 className="mx-auto h-16 w-16 text-orange-500 animate-spin mb-4" />
                                    <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Processando arquivo...
                                    </p>
                                    <p className="text-sm text-gray-500">Isso pode levar alguns instantes</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                                        <Upload size={48} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        Arraste seu arquivo CSV aqui
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                                        ou clique no botão abaixo para selecionar
                                    </p>

                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="csv-upload"
                                    />
                                    <label
                                        htmlFor="csv-upload"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg cursor-pointer hover:shadow-lg transition-all"
                                    >
                                        <Upload size={24} />
                                        Selecionar Arquivo CSV
                                    </label>
                                </>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                onClick={downloadTemplate}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
                            >
                                <Download size={20} />
                                Baixar Modelo CSV
                            </button>

                            <Link
                                href="/admin/produtos"
                                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Voltar para Produtos
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-6">
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-8 py-6 rounded-2xl text-center">
                                <CheckCircle size={32} className="mx-auto mb-2" />
                                <p className="text-4xl font-bold">{summary.success}</p>
                                <p className="font-bold">Importados</p>
                            </div>
                            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-8 py-6 rounded-2xl text-center">
                                <AlertCircle size={32} className="mx-auto mb-2" />
                                <p className="text-4xl font-bold">{summary.errors.length}</p>
                                <p className="font-bold">Erros</p>
                            </div>
                        </div>

                        {summary.errors.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 max-h-96 overflow-y-auto">
                                <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2 text-lg">
                                    <AlertCircle size={20} />
                                    Erros encontrados:
                                </h4>
                                <ul className="space-y-2 text-sm text-red-600 dark:text-red-300">
                                    {summary.errors.map((err, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-red-400">•</span>
                                            <span>{err}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSummary(null)}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Importar Outro Arquivo
                            </button>
                            <Link
                                href="/admin/produtos"
                                className="flex-1 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Ver Produtos Importados
                            </Link>
                        </div>
                    </div>
                )}
            </LiquidGlass>

            {/* Tips */}
            <div className="grid md:grid-cols-3 gap-4">
                <LiquidGlass className="p-4">
                    <div className="text-3xl mb-2">💡</div>
                    <h4 className="font-bold mb-1">Categorias</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Se não existir, o sistema cria automaticamente
                    </p>
                </LiquidGlass>

                <LiquidGlass className="p-4">
                    <div className="text-3xl mb-2">💰</div>
                    <h4 className="font-bold mb-1">Preços</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Use vírgula (12,90) ou ponto (12.90). Ambos funcionam
                    </p>
                </LiquidGlass>

                <LiquidGlass className="p-4">
                    <div className="text-3xl mb-2">🖼️</div>
                    <h4 className="font-bold mb-1">Imagens</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cole URLs públicas de imagens. Deixe vazio se não tiver
                    </p>
                </LiquidGlass>
            </div>
        </div>
    );
}
