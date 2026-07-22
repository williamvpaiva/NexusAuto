import { useState, useEffect, useCallback } from 'react';
import { Vehicle, CreateVehicleData, UpdateVehicleData, VehicleFilters, PaginationParams } from '../schemas/vehicle';
import { useToast } from '../context/ToastContext';

const API_BASE = '/api/v1/vehicles';

/**
 * Hook para gerenciar veículos
 * 
 * Gerencia listagem, criação, atualização e exclusão de veículos
 * com paginação, filtros e ordenação.
 * 
 * Uso:
 * const { vehicles, loading, filters, pagination, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
 */
export function useVehicles() {
  const toast = useToast();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de paginação
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    perPage: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // Estado de filtros
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * Carrega veículos com filtros e paginação atuais
   */
  const loadVehicles = useCallback(async () => {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      perPage: pagination.perPage.toString(),
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      ...Object.entries(filters)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {})
    });

    const response = await fetch(`${API_BASE}?${params}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Erro ao carregar veículos' } }));
      throw new Error(errorData.error?.message || 'Erro ao carregar veículos');
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error('Resposta inválida do servidor');
    }

    setVehicles(data.data);
    setTotal(data.meta?.total || 0);
    setTotalPages(data.meta?.totalPages || 0);
  }, [pagination, filters]);

  /**
   * Recarrega ao mudar paginação ou filtros
   */
  function onLoadError(active: boolean, message: string) {
    if (active) {
      setError(message);
      setVehicles([]);
    }
  }

  function onLoadComplete(active: boolean) {
    if (active) setLoading(false);
  }

  useEffect(() => {
    // eslint-disable react-hooks/set-state-in-effect
    let cancelled = false;

    loadVehicles()
      .catch(err => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Erro ao carregar veículos';
        toast.error('Erro ao carregar', message);
        onLoadError(!cancelled, message);
      })
      .finally(() => {
        onLoadComplete(!cancelled);
      });
    // eslint-enable react-hooks/set-state-in-effect

    return () => { cancelled = true; };
  }, [loadVehicles]);

  /**
   * Cria novo veículo
   */
  const createVehicle = async (data: CreateVehicleData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Erro ao criar veículo' } }));
        throw new Error(errorData.error?.message || 'Erro ao criar veículo');
      }

      const result = await response.json();
      
      toast.success('Veículo criado', 'O veículo foi cadastrado com sucesso');
      await loadVehicles();
      
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar veículo';
      toast.error('Erro ao criar', message);
      throw err;
    }
  };

  /**
   * Atualiza veículo existente
   */
  const updateVehicle = async (id: string, data: UpdateVehicleData) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Erro ao atualizar veículo' } }));
        throw new Error(errorData.error?.message || 'Erro ao atualizar veículo');
      }

      const result = await response.json();
      
      toast.success('Veículo atualizado', 'As alterações foram salvas');
      await loadVehicles();
      
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar veículo';
      toast.error('Erro ao atualizar', message);
      throw err;
    }
  };

  /**
   * Exclui veículo
   */
  const deleteVehicle = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Erro ao excluir veículo' } }));
        throw new Error(errorData.error?.message || 'Erro ao excluir veículo');
      }

      toast.success('Veículo excluído', 'O veículo foi removido');
      await loadVehicles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir veículo';
      toast.error('Erro ao excluir', message);
      throw err;
    }
  };

  /**
   * Atualiza filtros
   */
  const updateFilters = (newFilters: Partial<VehicleFilters>) => {
    setLoading(true);
    setError(null);
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset para página 1
  };

  /**
   * Limpa filtros
   */
  const clearFilters = () => {
    setLoading(true);
    setError(null);
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  /**
   * Navegação de paginação
   */
  const goToPage = (page: number) => {
    setLoading(true);
    setError(null);
    setPagination((prev) => ({ ...prev, page }));
  };

  const nextPage = () => {
    setLoading(true);
    setError(null);
    setPagination((prev) => ({ ...prev, page: Math.min(prev.page + 1, totalPages) }));
  };

  const prevPage = () => {
    setLoading(true);
    setError(null);
    setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }));
  };

  /**
   * Ordenação
   */
  const sortBy = (field: PaginationParams['sortBy']) => {
    setLoading(true);
    setError(null);
    setPagination((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  return {
    // Dados
    vehicles,
    loading,
    error,
    
    // Paginação
    pagination,
    total,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPrevPage: pagination.page > 1,
    
    // Filtros
    filters,
    
    // Ações
    loadVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    updateFilters,
    clearFilters,
    goToPage,
    nextPage,
    prevPage,
    sortBy
  };
}