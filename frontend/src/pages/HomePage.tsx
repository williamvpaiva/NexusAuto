import { FormEvent, useEffect, useState } from 'react';
import { createUser, listUsers, deleteUser, type User } from '../lib/api';
import { sanitizeText } from '../utils/sanitize';
import { useToast } from '../context/ToastContext';

export function HomePage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);

    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(message);
      toast.error('Erro ao carregar', message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await createUser({ name, email });
      setName('');
      setEmail('');
      const successMessage = 'Usuário criado com sucesso!';
      setSuccess(successMessage);
      toast.success('Usuário criado', successMessage);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(message);
      toast.error('Erro ao criar', message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja remover este usuário?')) {
      return;
    }

    try {
      await deleteUser(id);
      const successMessage = 'Usuário removido com sucesso!';
      setSuccess(successMessage);
      toast.success('Usuário removido', successMessage);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover usuário';
      setError(message);
      toast.error('Erro ao remover', message);
    }
  }

  return (
    <div className="grid">
      <section className="card">
        <h2>Novo usuário</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Nome
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Ada Lovelace"
              required
              minLength={2}
            />
          </label>

          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ada@example.com"
              type="email"
              required
            />
          </label>

          <button type="submit" disabled={saving || !name || !email}>
            {saving ? 'Salvando...' : 'Criar usuário'}
          </button>
        </form>

        {error && <p className="error" role="alert">{error}</p>}
        {success && <p className="success" role="status">{success}</p>}
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Usuários</h2>
          <button onClick={loadUsers} disabled={loading} className="secondary">
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {loading && <p className="loading">Carregando...</p>}

        {!loading && users.length === 0 && (
          <p className="empty">Nenhum usuário cadastrado.</p>
        )}

        {!loading && users.length > 0 && (
          <ul className="list">
            {users.map((user) => (
              <li key={user.id} className="list-item">
                <div className="user-info">
                  <strong>{sanitizeText(user.name)}</strong>
                  <span className="email">{sanitizeText(user.email)}</span>
                  <small className="date">
                    {new Date(user.createdAt).toLocaleString('pt-BR')}
                  </small>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="danger"
                  aria-label={`Remover ${sanitizeText(user.name)}`}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}