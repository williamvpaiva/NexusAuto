import { FormEvent, useEffect, useState } from 'react';
import { createUser, listUsers, deleteUser, type User } from '../lib/api';

export function HomePage() {
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
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
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
      setSuccess('Usuário criado com sucesso!');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
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
      setSuccess('Usuário removido com sucesso!');
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover usuário');
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

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
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
                  <strong>{user.name}</strong>
                  <span className="email">{user.email}</span>
                  <small className="date">
                    {new Date(user.createdAt).toLocaleString('pt-BR')}
                  </small>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="danger"
                  aria-label={`Remover ${user.name}`}
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