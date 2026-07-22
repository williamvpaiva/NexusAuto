import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  source: string;
  score: number;
  assignedToId: string | null;
  createdAt: string;
}

export function SalesDashboardPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/v1/leads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Erro ao buscar leads');
        
        const data = await response.json();
        if (data.success) {
          setLeads(data.data.leads || []);
        }
      } catch (err) {
        toast.error('Erro', 'Não foi possível carregar os leads');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [token, toast]);

  if (user?.role !== 'SALES' && user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>Acesso Negado</h2>
        <p>Você não tem permissão para acessar o painel de vendas.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>Painel de Vendas</h1>
          <p style={{ color: '#64748b' }}>Gerenciamento de Leads e Prospecções</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '8px', fontWeight: '600' }}>
          Total de Leads: {leads.length}
        </div>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Carregando leads...</div>
      ) : leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Nenhum lead encontrado.</p>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>Os leads capturados via webhook aparecerão aqui.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Nome</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Contato</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Score</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Origem</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{lead.name}</td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>
                    <div>{lead.email}</div>
                    <div style={{ fontSize: '0.85rem' }}>{lead.phone || '-'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.85rem', 
                      fontWeight: '600',
                      backgroundColor: lead.status === 'NEW' ? '#dbeafe' : lead.status === 'CONTACTED' ? '#fef3c7' : '#dcfce3',
                      color: lead.status === 'NEW' ? '#1e40af' : lead.status === 'CONTACTED' ? '#b45309' : '#166534'
                    }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '9999px', height: '6px' }}>
                        <div style={{ backgroundColor: lead.score > 70 ? '#22c55e' : lead.score > 40 ? '#f59e0b' : '#3b82f6', height: '6px', borderRadius: '9999px', width: `${Math.min(lead.score, 100)}%` }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>{lead.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b' }}>{lead.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
