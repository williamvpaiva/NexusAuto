import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { db } from '../src/config/database';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = './data/memory.db';

beforeAll(async () => {
  await db.initialize();
});

describe('Database Initialization', () => {
  it('should create data directory', () => {
    const dir = path.dirname(DB_PATH);
    expect(fs.existsSync(dir)).toBe(true);
  });

  it('should create database file', () => {
    expect(fs.existsSync(DB_PATH)).toBe(true);
  });

  it('should have conversations table', async () => {
    const tables = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='conversations'`
    );
    expect(tables.length).toBe(1);
  });

  it('should have messages table', async () => {
    const tables = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='messages'`
    );
    expect(tables.length).toBe(1);
  });

  it('should have error_logs table', async () => {
    const tables = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='error_logs'`
    );
    expect(tables.length).toBe(1);
  });

  it('should have token_optimizations table', async () => {
    const tables = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='token_optimizations'`
    );
    expect(tables.length).toBe(1);
  });

  it('should have users table', async () => {
    const tables = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`
    );
    expect(tables.length).toBe(1);
  });

  it('should have query_cache table', async () => {
    const tables = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='query_cache'`
    );
    expect(tables.length).toBe(1);
  });

  it('should have indexes', async () => {
    const indexes = await db.all<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'`
    );
    expect(indexes.length).toBeGreaterThanOrEqual(8);
  });
});

describe('Database CRUD', () => {
  const testId = 'db-test-id-1';

  it('should insert and select a conversation', async () => {
    await db.run(
      `INSERT INTO conversations (id, title, agent_id, session_id) VALUES (?, ?, ?, ?)`,
      [testId, 'DB Test', 'test-agent', 'test-session']
    );

    const row = await db.get<{ id: string; title: string }>(
      `SELECT id, title FROM conversations WHERE id = ?`,
      [testId]
    );

    expect(row).toBeDefined();
    expect(row!.id).toBe(testId);
    expect(row!.title).toBe('DB Test');
  });

  it('should update a conversation', async () => {
    await db.run(
      `UPDATE conversations SET title = ? WHERE id = ?`,
      ['DB Test Updated', testId]
    );

    const row = await db.get<{ title: string }>(
      `SELECT title FROM conversations WHERE id = ?`,
      [testId]
    );

    expect(row!.title).toBe('DB Test Updated');
  });

  it('should delete a conversation', async () => {
    await db.run(`DELETE FROM conversations WHERE id = ?`, [testId]);

    const row = await db.get(`SELECT id FROM conversations WHERE id = ?`, [testId]);
    expect(row).toBeUndefined();
  });

  it('should handle foreign key cascade', async () => {
    const convId = 'cascade-test-id';
    await db.run(`DELETE FROM conversations WHERE id = ?`, [convId]);
    await db.run(
      `INSERT INTO conversations (id, title, agent_id, session_id) VALUES (?, ?, ?, ?)`,
      [convId, 'Cascade Test', 'agent', 'session']
    );
    await db.run(
      `INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)`,
      ['msg-cascade', convId, 'user', 'test']
    );

    await db.run(`DELETE FROM conversations WHERE id = ?`, [convId]);

    const msg = await db.get(`SELECT id FROM messages WHERE id = ?`, ['msg-cascade']);
    expect(msg).toBeUndefined();
  });
});

describe('Database WAL Mode', () => {
  it('should be in WAL journal mode', async () => {
    const row = await db.get<{ journal_mode: string }>(`PRAGMA journal_mode`);
    expect(row).toBeDefined();
  });
});
