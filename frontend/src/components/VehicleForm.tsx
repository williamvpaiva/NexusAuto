import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateVehicleSchema, Vehicle } from '../schemas/vehicle';
import { useVehicles } from '../hooks/useVehicles';
import { useToast } from '../context/ToastContext';

interface VehicleFormData {
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
  fuelType: 'gasolina' | 'etanol' | 'flex' | 'diesel' | 'eletrico' | 'hibrido';
  transmission: 'manual' | 'automatico' | 'cvt';
  plate: string;
  description?: string;
}

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function VehicleForm({ vehicle, onSuccess, onCancel }: VehicleFormProps) {
  const toast = useToast();
  const { createVehicle, updateVehicle } = useVehicles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!vehicle;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset
  } = useForm<VehicleFormData>({
    resolver: zodResolver(CreateVehicleSchema as any),
    mode: 'onChange',
    defaultValues: vehicle ? {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: vehicle.price,
      mileage: vehicle.mileage,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      plate: vehicle.plate,
      description: vehicle.description || ''
    } : {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      price: 0,
      mileage: 0,
      fuelType: 'flex',
      transmission: 'automatico',
      plate: '',
      description: ''
    }
  });

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditing && vehicle) {
        await updateVehicle(vehicle.id, data);
        toast.success('Veículo atualizado', 'As alterações foram salvas com sucesso');
      } else {
        await createVehicle(data);
        toast.success('Veículo criado', 'O veículo foi cadastrado com sucesso');
      }

      reset();
      onSuccess?.();
    } catch (err) {
      // Erro já tratado no hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Linha 1: Marca e Modelo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="brand" style={labelStyle}>Marca</label>
          <input
            id="brand"
            {...register('brand')}
            placeholder="Ex.: Toyota"
            style={inputStyle(!!errors.brand)}
          />
          {errors.brand && <p style={errorStyle}>{errors.brand.message}</p>}
        </div>

        <div>
          <label htmlFor="model" style={labelStyle}>Modelo</label>
          <input
            id="model"
            {...register('model')}
            placeholder="Ex.: Corolla XEi"
            style={inputStyle(!!errors.model)}
          />
          {errors.model && <p style={errorStyle}>{errors.model.message}</p>}
        </div>
      </div>

      {/* Linha 2: Ano e Cor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="year" style={labelStyle}>Ano</label>
          <input
            id="year"
            type="number"
            {...register('year', { valueAsNumber: true })}
            placeholder="Ex.: 2024"
            min={1900}
            max={new Date().getFullYear() + 1}
            style={inputStyle(!!errors.year)}
          />
          {errors.year && <p style={errorStyle}>{errors.year.message}</p>}
        </div>

        <div>
          <label htmlFor="color" style={labelStyle}>Cor</label>
          <input
            id="color"
            {...register('color')}
            placeholder="Ex.: Prata"
            style={inputStyle(!!errors.color)}
          />
          {errors.color && <p style={errorStyle}>{errors.color.message}</p>}
        </div>
      </div>

      {/* Linha 3: Preço e Quilometragem */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="price" style={labelStyle}>Preço (R$)</label>
          <input
            id="price"
            type="number"
            {...register('price', { valueAsNumber: true })}
            placeholder="Ex.: 150000"
            min={0}
            step={0.01}
            style={inputStyle(!!errors.price)}
          />
          {errors.price && <p style={errorStyle}>{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="mileage" style={labelStyle}>Quilometragem (km)</label>
          <input
            id="mileage"
            type="number"
            {...register('mileage', { valueAsNumber: true })}
            placeholder="Ex.: 45000"
            min={0}
            style={inputStyle(!!errors.mileage)}
          />
          {errors.mileage && <p style={errorStyle}>{errors.mileage.message}</p>}
        </div>
      </div>

      {/* Linha 4: Combustível e Câmbio */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="fuelType" style={labelStyle}>Combustível</label>
          <select id="fuelType" {...register('fuelType')} style={inputStyle(!!errors.fuelType)}>
            <option value="">Selecione</option>
            <option value="gasolina">Gasolina</option>
            <option value="etanol">Etanol</option>
            <option value="flex">Flex</option>
            <option value="diesel">Diesel</option>
            <option value="eletrico">Elétrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
          {errors.fuelType && <p style={errorStyle}>{errors.fuelType.message}</p>}
        </div>

        <div>
          <label htmlFor="transmission" style={labelStyle}>Câmbio</label>
          <select id="transmission" {...register('transmission')} style={inputStyle(!!errors.transmission)}>
            <option value="">Selecione</option>
            <option value="manual">Manual</option>
            <option value="automatico">Automático</option>
            <option value="cvt">CVT</option>
          </select>
          {errors.transmission && <p style={errorStyle}>{errors.transmission.message}</p>}
        </div>
      </div>

      {/* Linha 5: Placa */}
      <div>
        <label htmlFor="plate" style={labelStyle}>Placa (Mercosul)</label>
        <input
          id="plate"
          {...register('plate')}
          placeholder="Ex.: ABC1D23"
          style={{ textTransform: 'uppercase', ...inputStyle(!!errors.plate) }}
          maxLength={7}
        />
        {errors.plate && <p style={errorStyle}>{errors.plate.message}</p>}
        <p style={{ ...hintStyle, marginTop: '0.25rem' }}>Formato: 3 letras + 1 número/letra + 2 números</p>
      </div>

      {/* Linha 6: Descrição */}
      <div>
        <label htmlFor="description" style={labelStyle}>Descrição (opcional)</label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Descreva o veículo, opcionais, histórico, etc."
          rows={4}
          style={{ ...inputStyle(!!errors.description), resize: 'vertical' }}
          maxLength={1000}
        />
        {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{ ...buttonStyle, ...secondaryButtonStyle }}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || (!isEditing && (!isValid || !isDirty))}
          style={{
            ...buttonStyle,
            ...primaryButtonStyle,
            opacity: isSubmitting || (!isEditing && (!isValid || !isDirty)) ? 0.6 : 1
          }}
        >
          {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Veículo'}
        </button>
      </div>
    </form>
  );
}

// Estilos inline (substituir por Tailwind/CSS Modules em produção)
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#334155'
};

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '0.875rem 1rem',
  borderRadius: '10px',
  border: hasError ? '1px solid #dc2626' : '1px solid #cbd5e1',
  fontSize: '1rem',
  transition: 'all 0.2s',
  outline: 'none'
});

const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: '0.875rem',
  marginTop: '0.375rem'
};

const hintStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '0.8rem'
};

const buttonStyle: React.CSSProperties = {
  padding: '0.875rem 1.5rem',
  borderRadius: '10px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s'
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb',
  color: 'white'
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#e2e8f0',
  color: '#0f172a'
};
