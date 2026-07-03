import { db } from '../config/database';
import type { CreateUserInput, UpdateUserInput, User } from '../types/user';

export class UsersRepository {
  async createTable(): Promise<void> {
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async findAll(): Promise<User[]> {
    const rows = await db.all<{ id: string; name: string; email: string; created_at: string; updated_at: string | null }>(
      'SELECT * FROM users ORDER BY name ASC'
    );
    return rows.map(this.mapRow);
  }

  async findById(id: string): Promise<User | undefined> {
    const row = await db.get<{ id: string; name: string; email: string; created_at: string; updated_at: string | null }>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return row ? this.mapRow(row) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const row = await db.get<{ id: string; name: string; email: string; created_at: string; updated_at: string | null }>(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );
    return row ? this.mapRow(row) : undefined;
  }

  async create(data: CreateUserInput): Promise<User> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const email = data.email.toLowerCase().trim();

    await db.run(
      'INSERT INTO users (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [id, data.name.trim(), email, now, now]
    );

    return { id, name: data.name.trim(), email, createdAt: now, updatedAt: now };
  }

  async update(id: string, data: UpdateUserInput): Promise<User | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const name = data.name?.trim() ?? existing.name;
    const email = data.email ? data.email.toLowerCase().trim() : existing.email;

    await db.run(
      'UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?',
      [name, email, now, id]
    );

    return { id, name, email, createdAt: existing.createdAt, updatedAt: now };
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  async count(): Promise<number> {
    const row = await db.get<{ total: number }>('SELECT COUNT(*) as total FROM users');
    return row?.total || 0;
  }

  private mapRow(row: { id: string; name: string; email: string; created_at: string; updated_at: string | null }): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? undefined,
    };
  }
}

export const usersRepository = new UsersRepository();
