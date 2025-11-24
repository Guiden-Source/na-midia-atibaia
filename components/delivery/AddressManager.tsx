'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, X } from 'lucide-react';
import { AddressForm, AddressFormData } from './address/AddressForm';
import { AddressList, SavedAddress } from './address/AddressList';

export function AddressManager({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

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

  const handleSubmit = async (formData: AddressFormData) => {
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
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAddress(null);
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
        <AddressForm
          initialData={editingAddress ? {
            label: editingAddress.label,
            street: editingAddress.street,
            number: editingAddress.number,
            complement: editingAddress.complement || '',
            condominium: editingAddress.condominium,
            block: editingAddress.block || '',
            apartment: editingAddress.apartment || '',
            reference: editingAddress.reference || '',
            is_default: editingAddress.is_default,
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingAddress}
        />
      )}

      {/* Lista de Endereços */}
      <AddressList
        addresses={addresses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
      />
    </div>
  );
}

