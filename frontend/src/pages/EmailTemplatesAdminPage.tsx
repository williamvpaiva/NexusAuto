import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { getAccessToken } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  createdAt: string;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// EmailTemplatesAdminPage
// ---------------------------------------------------------------------------

export function EmailTemplatesAdminPage() {
  const toast = useToast();

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formHtml, setFormHtml] = useState('');

  // -----------------------------------------------------------------------
  // Load templates
  // -----------------------------------------------------------------------

  /** Helper: adiciona auth header aos requests */
  const authHeaders = useCallback((): Record<string, string> => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const loadTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/email-templates', {
        headers: { ...authHeaders() },
      });
      if (!res.ok) throw new Error('Falha ao carregar templates');
      const body = await res.json();
      setTemplates(body.data || []);
    } catch (err: any) {
      toast.error('Erro', err.message || 'Falha ao carregar templates');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // -----------------------------------------------------------------------
  // Create / Update
  // -----------------------------------------------------------------------

  const openNew = () => {
    setEditing(null);
    setIsNew(true);
    setFormName('');
    setFormSubject('');
    setFormHtml('<h1>Novo template</h1>\n<p>{{VARIAVEL}}</p>');
    setPreviewHtml(null);
  };

  const openEdit = (tpl: EmailTemplate) => {
    setEditing(tpl);
    setIsNew(false);
    setFormName(tpl.name);
    setFormSubject(tpl.subject);
    setFormHtml(tpl.htmlBody);
    setPreviewHtml(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsNew(false);
    setPreviewHtml(null);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formSubject.trim() || !formHtml.trim()) {
      toast.error('Validação', 'Preencha todos os campos');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch('/api/v1/email-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ name: formName, subject: formSubject, htmlBody: formHtml }),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body?.error?.message || 'Erro ao criar');
        }
        toast.success('Criado!', 'Template criado com sucesso.');
      } else if (editing) {
        const res = await fetch(`/api/v1/email-templates/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({ name: formName, subject: formSubject, htmlBody: formHtml }),
        });
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body?.error?.message || 'Erro ao atualizar');
        }
        toast.success('Atualizado!', 'Template salvo com sucesso.');
      }
      cancelEdit();
      await loadTemplates();
    } catch (err: any) {
      toast.error('Erro', err.message);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------

  const handleDelete = async (tpl: EmailTemplate) => {
    if (!window.confirm(`Remover template "${tpl.name}"?`)) return;

    try {
      const res = await fetch(`/api/v1/email-templates/${tpl.id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || 'Erro ao remover');
      }
      toast.success('Removido!', `Template "${tpl.name}" removido.`);
      await loadTemplates();
    } catch (err: any) {
      toast.error('Erro', err.message);
    }
  };

  // -----------------------------------------------------------------------
  // Preview
  // -----------------------------------------------------------------------

  const handlePreview = async (tpl: EmailTemplate) => {
    try {
      // Renderiza no servidor com variáveis de exemplo
      const renderRes = await fetch(`/api/v1/email-templates/${tpl.id}/preview`, {
        method: 'POST',
        headers: { ...authHeaders() },
      });
      if (!renderRes.ok) throw new Error('Falha ao renderizar preview');
      const body = await renderRes.json();
      setPreviewHtml(body?.data?.html || tpl.htmlBody);
    } catch (err: any) {
      // Fallback: mostra o HTML cru
      setPreviewHtml(tpl.htmlBody);
    }
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="app-shell">
        <div className="topbar">
          <div>
            <h1>Templates de Email</h1>
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Form de edição/criação
  if (isNew || editing) {
    return (
      <div className="app-shell">
        <div className="topbar">
          <div>
            <h1>{isNew ? 'Novo Template' : 'Editar Template'}</h1>
            <p>{isNew ? 'Crie um novo template de email' : `Editando: ${editing?.name}`}</p>
          </div>
          <div className="nav">
            <button onClick={cancelEdit} className="secondary">Cancelar</button>
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

        <div className="content">
          <div className="card">
            <div className="form">
              <div>
                <label htmlFor="tpl-name">Nome do template</label>
                <input
                  id="tpl-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ex: reset-password"
                />
              </div>

              <div>
                <label htmlFor="tpl-subject">Assunto do email</label>
                <input
                  id="tpl-subject"
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Redefina sua senha - {{APP_NAME}}"
                />
              </div>

              <div>
                <label htmlFor="tpl-html">HTML do template</label>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  Use {'{{RESET_LINK}}'} para o link de redefinição de senha. Outras variáveis podem ser adicionadas conforme necessário.
                </p>
                <textarea
                  id="tpl-html"
                  value={formHtml}
                  onChange={(e) => setFormHtml(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '400px',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontFamily: "'Consolas', 'Monaco', monospace",
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Caracteres do HTML */}
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'right' }}>
            {formHtml.length} caracteres
          </p>
        </div>
      </div>
    );
  }

  // Preview modal
  if (previewHtml) {
    return (
      <div className="app-shell">
        <div className="topbar">
          <div>
            <h1>Preview do Template</h1>
            <p>Visualização com variáveis de exemplo</p>
          </div>
          <div className="nav">
            <button onClick={() => setPreviewHtml(null)} className="secondary">
              Voltar
            </button>
          </div>
        </div>
        <div className="content">
          <div
            className="card"
            style={{ overflow: 'auto', maxHeight: '80vh' }}
          >
            <iframe
              title="Preview"
              srcDoc={previewHtml}
              style={{
                width: '100%',
                minHeight: '500px',
                border: 'none',
                borderRadius: '8px',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Lista de templates
  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <h1>Templates de Email</h1>
          <p>Gerencie os templates de email do sistema</p>
        </div>
        <div className="nav">
          <button onClick={openNew}>+ Novo Template</button>
        </div>
      </div>

      <div className="content">
        {templates.length === 0 ? (
          <p className="empty">Nenhum template encontrado. Crie o primeiro.</p>
        ) : (
          <div className="list">
            {templates.map((tpl) => (
              <div key={tpl.id} className="list-item">
                <div className="user-info">
                  <strong>{tpl.name}</strong>
                  <span className="email">{tpl.subject}</span>
                  <span className="date">
                    Criado em {new Date(tpl.createdAt).toLocaleDateString('pt-BR')}
                    {tpl.updatedAt && ` · Atualizado em ${new Date(tpl.updatedAt).toLocaleDateString('pt-BR')}`}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="secondary"
                    onClick={() => handlePreview(tpl)}
                    title="Visualizar"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    👁️
                  </button>
                  <button
                    className="secondary"
                    onClick={() => openEdit(tpl)}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    Editar
                  </button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(tpl)}
                    disabled={tpl.id === 'reset-password-default'}
                    title={tpl.id === 'reset-password-default' ? 'Template padrão não pode ser removido' : 'Remover'}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
