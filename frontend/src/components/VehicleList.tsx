import { useState } from 'react';
import { Vehicle } from '../schemas/vehicle';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleForm } from './VehicleForm';
import { sanitizeText } from '../utils/sanitize';

interface VehicleListProps {
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
}

/**
 * Lista de Veículos com Paginação e Filtros
 * 
 * Exibe lista de veículos com:
 * - Paginação server-side
 * - Filtros por marca, modelo, ano, preço
 * - Ordenação por colunas
 * - Ações de editar/excluir
 */
export function VehicleList({  onDelete }: VehicleListProps) {
  const {
    vehicles,
    loading,
    error,
    pagination,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    filters,
    updateFilters,
    clearFilters,
    
    nextPage,
    prevPage,
    
    deleteVehicle
  } = useVehicles();

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Handler para exclusão com confirmação
  const handleDelete = async (id: string, brand: string, model: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${brand} ${model}?`)) {
      return;
    }

    try {
      await deleteVehicle(id);
      onDelete?.(id);
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  // Renderização de valor monetário
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Badge de tipo de combustível
  const fuelTypeBadge = (fuelType: string) => {
    const colors: Record<string, string> = {
      gasolina: '#22c55e',
      etanol: '#84cc16',
      flex: '#eab308',
      diesel: '#f97316',
      eletrico: '#3b82f6',
      hibrido: '#8b5cf6'
    };

    return (
      <span
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: colors[fuelType] || '#64748b',
          color: 'white',
          textTransform: 'capitalize'
        }}
      >
        {fuelType}
      </span>
    );
  };

  if (editingVehicle) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          Editar Veículo
        </h2>
        <VehicleForm
          vehicle={editingVehicle}
          onSuccess={() => setEditingVehicle(null)}
          onCancel={() => setEditingVehicle(null)}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Veículos ({total})
          </h1>
          <p style={{ color: '#64748b' }}>
            Página {pagination.page} de {totalPages || 1}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: showFilters ? '#2563eb' : '#e2e8f0',
            color: showFilters ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {showFilters ? 'Ocultar Filtros' : 'Filtrar'}
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Marca</label>
              <input
                type="text"
                placeholder="Ex.: Toyota"
                value={filters.brand || ''}
                onChange={(e) => updateFilters({ brand: e.target.value || undefined })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Modelo</label>
              <input
                type="text"
                placeholder="Ex.: Corolla"
                value={filters.model || ''}
                onChange={(e) => updateFilters({ model: e.target.value || undefined })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Ano Mínimo</label>
              <input
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                value={filters.yearMin || ''}
                onChange={(e) => updateFilters({ yearMin: e.target.value ? Number(e.target.value) : undefined })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Preço Máximo (R$)</label>
              <input
                type="number"
                min={0}
                value={filters.priceMax || ''}
                onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                style={inputStyle}
              />
            </div>
          </div>
          <button
            onClick={clearFilters}
            style={{
              marginTop: '1rem',
              padding: '0.625rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Lista de Veículos */}
      {!loading && !error && vehicles.length === 0 && (
        <div
          style={{
            padding: '4rem',
            textAlign: 'center',
            color: '#64748b'
          }}
        >
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Nenhum veículo encontrado</p>
          <p>Crie um novo veículo ou ajuste os filtros</p>
        </div>
      )}

      {/* Cards de Veículos */}
      {!loading && vehicles.length > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Header do Card */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {sanitizeText(vehicle.brand)} {sanitizeText(vehicle.model)}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {vehicle.year} • {vehicle.mileage.toLocaleString('pt-BR')} km
                  </p>
                </div>

                {/* Preço */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2563eb' }}>
                    {formatPrice(vehicle.price)}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {fuelTypeBadge(vehicle.fuelType)}
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: '#e2e8f0',
                      color: '#475569',
                      textTransform: 'capitalize'
                    }}
                  >
                    {vehicle.transmission}
                  </span>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b'
                    }}
                  >
                    {sanitizeText(vehicle.plate)}
                  </span>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => setEditingVehicle(vehicle)}
                    style={{
                      flex: 1,
                      padding: '0.625rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id, vehicle.brand, vehicle.model)}
                    style={{
                      flex: 1,
                      padding: '0.625rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
              padding: '1.5rem'
            }}
          >
            <button
              onClick={prevPage}
              disabled={!hasPrevPage}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: hasPrevPage ? '#e2e8f0' : '#f1f5f9',
                color: hasPrevPage ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: hasPrevPage ? 'pointer' : 'not-allowed'
              }}
            >
              Anterior
            </button>

            <span style={{ color: '#475569', fontWeight: '500' }}>
              Página {pagination.page} de {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={!hasNextPage}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: hasNextPage ? '#e2e8f0' : '#f1f5f9',
                color: hasNextPage ? '#0f172a' : '#cbd5e1',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: hasNextPage ? 'pointer' : 'not-allowed'
              }}
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Estilos inline
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#334155'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.95rem'
};
