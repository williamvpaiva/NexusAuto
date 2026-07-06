import sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { Conversation, Message, ErrorLog, TokenOptimization } from '../types/memory'; // eslint-disable-line @typescript-eslint/no-unused-vars

export class Database {
  private db: sqlite3.Database;
  private static instance: Database;

  private constructor() {
    const dbPath = './data/memory.db';
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new sqlite3.Database(dbPath);
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async run(sql: string, params: unknown[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: Error | null, row: unknown) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  async all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: Error | null, rows: unknown[]) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async initialize(): Promise<void> {
    await this.run(`PRAGMA journal_mode=WAL`);
    await this.run(`PRAGMA busy_timeout=5000`);
    await this.run(`PRAGMA foreign_keys=ON`);
    await this.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        session_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        token_count INTEGER DEFAULT 0,
        message_count INTEGER DEFAULT 0,
        metadata TEXT
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        token_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS error_logs (
        id TEXT PRIMARY KEY,
        conversation_id TEXT,
        error_code TEXT NOT NULL,
        error_message TEXT NOT NULL,
        error_stack TEXT,
        context TEXT,
        resolution_steps TEXT,
        resolution_summary TEXT,
        status TEXT DEFAULT 'open' CHECK(status IN ('open', 'investigating', 'resolved', 'closed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS token_optimizations (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        original_token_count INTEGER NOT NULL,
        optimized_token_count INTEGER NOT NULL,
        compression_ratio REAL NOT NULL,
        strategy TEXT NOT NULL CHECK(strategy IN ('summary', 'truncate', 'compress', 'cache')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS query_cache (
        id TEXT PRIMARY KEY,
        query_hash TEXT NOT NULL UNIQUE,
        result TEXT NOT NULL,
        hits INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id TEXT PRIMARY KEY,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        color TEXT NOT NULL,
        price REAL NOT NULL,
        mileage INTEGER NOT NULL,
        fuel_type TEXT NOT NULL CHECK(fuel_type IN ('gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido')),
        transmission TEXT NOT NULL CHECK(transmission IN ('manual', 'automatico', 'cvt')),
        plate TEXT NOT NULL UNIQUE,
        description TEXT,
        images TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed de usuário admin (se não existir)
    await this.run(`
      INSERT OR IGNORE INTO users (id, name, email, password, role)
      VALUES ('admin-001', 'Admin User', 'admin@polymarketing.com', 'admin123', 'admin')
    `);

    // Índices para performance
    await this.run(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_conversations_agent ON conversations(agent_id)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_errors_status ON error_logs(status)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_errors_conversation ON error_logs(conversation_id)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_cache_query ON query_cache(query_hash)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_cache_expires ON query_cache(expires_at)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_vehicles_fuel_type ON vehicles(fuel_type)`);
    
    // Índices Compostos (PERF-004)
    await this.run(`CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON messages(conversation_id, created_at)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_vehicles_brand_model ON vehicles(brand, model)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price)`);
    await this.run(`CREATE INDEX IF NOT EXISTS idx_conversations_agent_created ON conversations(agent_id, created_at)`);
  }
}

export const db = Database.getInstance();