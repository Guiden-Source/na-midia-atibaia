'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit, Trash2, Check, X, Star } from 'lucide-react';

type SavedAddress = {
  id: string;
  user_id: string;
  label: string;
  street: string;
  number: string;
  complement?: string;
  condominium: string;
  block?: string;
  apartment?: string;
  reference?: string;
  is_default: boolean;
  created_at: string;
};

type AddressFormData = {
  label: string;
  street: string;
  number: string;
  complement: string;
  condominium: string;
  block: string;
  apartment: string;
  reference: string;
  is_default: boolean;
};

const CONDOMINIUMS = [
  'Jeronimo de Camargo 1',
  'Jeronimo de Camargo 2',
];

export function AddressManager({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    label: '',
    street: '',
    number: '',
    complement: '',
    condominium: '',
    block: '',
    apartment: '',
    reference: '',
    is_default: false,
  });

  const supabase = createClient();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('delivery_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao carregar endereços:', error);
    } else {
      setAddresses(data || []);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Se este endereço é padrão, remover padrão dos outros
      if (formData.is_default) {
        await supabase
          .from('delivery_addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      if (editingAddress) {
        // Atualizar endereço
        const { error } = await supabase
          .from('delivery_addresses')
          .update(formData)
          .eq('id', editingAddress.id);

        if (error) throw error;
      } else {
        // Criar novo endereço
        const { error } = await supabase
          .from('delivery_addresses')
          .insert([{ ...formData, user_id: userId }]);

        if (error) throw error;
      }

      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      alert('Erro ao salvar endereço. Tente novamente.');
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Deseja realmente excluir este endereço?')) return;

    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      await loadAddresses();
    } catch (error) {
      console.error('Erro ao excluir endereço:', error);
      alert('Erro ao excluir endereço. Tente novamente.');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      // Remover padrão de todos
      await supabase
        .from('delivery_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Definir novo padrão
      const { error } = await supabase
        .from('delivery_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;

      await loadAddresses();
    } catch (error) {
      console.error('Erro ao definir endereço padrão:', error);
    }
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      condominium: address.condominium,
      block: address.block || '',
      apartment: address.apartment || '',
      reference: address.reference || '',
      is_default: address.is_default,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      label: '',
      street: '',
      number: '',
      complement: '',
      condominium: '',
      block: '',
      apartment: '',
      reference: '',
      is_default: false,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botão Adicionar */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {showForm ? (
            <>
              <X size={20} />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Adicionar Endereço</span>
            </>
          )}
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Endereço *
              </label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Ex: Casa, Trabalho, Apartamento..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Condomínio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Condomínio *
              </label>
              <select
                required
                value={formData.condominium}
                onChange={(e) => setFormData({ ...formData, condominium: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {CONDOMINIUMS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rua */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rua *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Número */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bloco */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bloco
                </label>
                <input
                  type="text"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Apartamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apartamento
                </label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Complemento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Complemento
              </label>
              <input
                type="text"
                value={formData.complement}
                onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                placeholder="Ex: Próximo ao portão principal"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Referência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ponto de Referência
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Ex: Casa azul, portão branco"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Checkbox padrão */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Definir como endereço padrão
                </span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <Check size={20} />
                <span>{editingAddress ? 'Atualizar' : 'Salvar'} Endereço</span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <X size={20} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Endereços */}
      {addresses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-md">
          <div className="text-6xl mb-4">📍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Nenhum endereço salvo
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Adicione endereços para facilitar suas compras futuras
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-2 transition-all ${
                address.is_default
                  ? 'border-yellow-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {address.label}
                    {address.is_default && (
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {address.condominium}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>{address.street}, {address.number}</p>
                {address.block && <p>Bloco {address.block}</p>}
                {address.apartment && <p>Apto {address.apartment}</p>}
                {address.complement && <p>{address.complement}</p>}
                {address.reference && (
                  <p className="text-xs italic">Ref: {address.reference}</p>
                )}
              </div>

              {/* Botão Padrão */}
              {!address.is_default && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Definir como padrão
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
