'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { createClient } from '@/lib/supabase/client';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import toast from 'react-hot-toast';

interface ProductImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface CSVRow {
    nome: string;
    descricao?: string;
    preco: string;
    promocao?: string;
    categoria: string;
    ativo?: string;
    estoque?: string;
}

export function ProductImportModal({ isOpen, onClose, onSuccess }: ProductImportModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState<{ total: number; success: number; errors: string[] } | null>(null);

    const processFile = async (file: File) => {
        setIsProcessing(true);
        setSummary(null);
        const supabase = createClient();

        Papa.parse<CSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data;
                const errors: string[] = [];
                let successCount = 0;

                // 1. Carregar categorias existentes para mapear
                const { data: categories } = await supabase.from('delivery_categories').select('id, name');
                const categoryMap = new Map(categories?.map(c => [c.name.toLowerCase().trim(), c.id]));

                try {
                    for (const [index, row] of rows.entries()) {
                        const rowNum = index + 2; // +2 por causa do header (1-based) e 0-based index

                        // Validação básica
                        if (!row.nome || !row.preco || !row.categoria) {
                            errors.push(`Linha ${rowNum}: Nome, Preço e Categoria são obrigatórios.`);
                            continue;
                        }

                        // Resolver Categoria
                        let categoryId = categoryMap.get(row.categoria.toLowerCase().trim());

                        // Criar categoria se não existir
                        if (!categoryId) {
                            const { data: newCat, error: catError } = await supabase
                                .from('delivery_categories')
                                .insert({
                                    name: row.categoria.trim(),
                                    slug: row.categoria.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                                    order_index: 99
                                })
                                .select()
                                .single();

                            if (catError || !newCat) {
                                errors.push(`Linha ${rowNum}: Erro ao criar categoria "${row.categoria}"`);
                                continue;
                            }
                            categoryId = newCat.id;
                            categoryMap.set(row.categoria.toLowerCase().trim(), categoryId);
                        }

                        // Formatar Preços (R$ 10,90 -> 10.90)
                        const price = parseFloat(row.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
                        const promoPrice = row.promocao ? parseFloat(row.promocao.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) : null;

                        if (isNaN(price)) {
                            errors.push(`Linha ${rowNum}: Preço inválido "${row.preco}"`);
                            continue;
                        }

                        // Inserir Produto
                        const { error: prodError } = await supabase.from('delivery_products').insert({
                            name: row.nome.trim(),
                            description: row.descricao?.trim() || null,
                            price: price,
                            promotional_price: promoPrice,
                            category_id: categoryId,
                            is_active: row.ativo ? row.ativo.toLowerCase() === 'sim' || row.ativo === 'true' : true,
                            stock_quantity: row.estoque ? parseInt(row.estoque) : null,
                            image_url: null // Upload de imagem em massa é complexo via CSV simples
                        });

                        if (prodError) {
                            errors.push(`Linha ${rowNum}: Erro ao salvar produto - ${prodError.message}`);
                        } else {
                            successCount++;
                        }
                    }

                    if (successCount > 0) {
                        toast.success(`${successCount} produtos importados!`);
                        onSuccess();
                    } else if (errors.length > 0) {
                        toast.error('Nenhum produto foi importado.');
                    }

                    setSummary({ total: rows.length, success: successCount, errors });

                } catch (error) {
                    console.error('Erro geral:', error);
                    toast.error('Erro crítico na importação');
                } finally {
                    setIsProcessing(false);
                }
            },
            error: (error) => {
                console.error('Erro CSV:', error);
                toast.error('Erro ao ler arquivo CSV');
                setIsProcessing(false);
            }
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/csv' || file.name.endsWith('.csv')) {
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
        const csvContent = "nome,descricao,preco,promocao,categoria,ativo,estoque\nExemplo Burger,Delicioso hamburguer com queijo,25.90,19.90,Lanches,sim,100\nCoca Cola 2L,Refrigerante gelado,12.00,,Bebidas,sim,50";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'modelo_importacao_produtos.csv';
        link.click();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xl"
                >
                    <LiquidGlass className="p-0 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">
                                    Importar Produtos em Massa
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Envie um arquivo CSV para adicionar vários produtos
                                </p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {!summary ? (
                                <>
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        className={`border-3 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                                            : 'border-gray-300 dark:border-gray-700 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <div className="py-8">
                                                <Loader2 className="mx-auto h-12 w-12 text-orange-500 animate-spin mb-4" />
                                                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                                                    Processando arquivo...
                                                </p>
                                                <p className="text-sm text-gray-500">Isso pode levar alguns instantes</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 dark:text-orange-400">
                                                    <Upload size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                    Arraste e solte seu CSV aqui
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                                    ou clique para selecionar do computador
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
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all"
                                                >
                                                    <FileSpreadsheet size={20} />
                                                    Selecionar Arquivo
                                                </label>
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        <button
                                            onClick={downloadTemplate}
                                            className="text-sm text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                                        >
                                            <DownloadIcon size={16} />
                                            Baixar modelo de exemplo (.csv)
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center gap-4 text-center">
                                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-4 rounded-xl">
                                            <p className="text-3xl font-bold">{summary.success}</p>
                                            <p className="text-sm font-bold">Sucesso</p>
                                        </div>
                                        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl">
                                            <p className="text-3xl font-bold">{summary.errors.length}</p>
                                            <p className="text-sm font-bold">Erros</p>
                                        </div>
                                    </div>

                                    {summary.errors.length > 0 && (
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 max-h-60 overflow-y-auto">
                                            <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                                <AlertCircle size={18} />
                                                Erros encontrados:
                                            </h4>
                                            <ul className="space-y-1 text-sm text-red-600 dark:text-red-300">
                                                {summary.errors.map((err, i) => (
                                                    <li key={i}>• {err}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSummary(null)}
                                            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                                        >
                                            Importar Outro
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                                        >
                                            Concluir
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </LiquidGlass>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function DownloadIcon({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    );
}
