import crypto from 'crypto';
import { db } from '../config/database';
import type { IEmailTemplatesRepository } from './interfaces/IEmailTemplatesRepository';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlBody: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEmailTemplateInput {
  name: string;
  subject: string;
  htmlBody: string;
}

export interface UpdateEmailTemplateInput {
  name?: string;
  subject?: string;
  htmlBody?: string;
}

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export class EmailTemplatesRepository implements IEmailTemplatesRepository {
  async findAll(): Promise<EmailTemplate[]> {
    const rows = await db.all<{
      id: string;
      name: string;
      subject: string;
      html_body: string;
      created_at: string;
      updated_at: string | null;
    }>('SELECT * FROM email_templates ORDER BY name ASC');
    return rows.map(this.mapRow);
  }

  async findById(id: string): Promise<EmailTemplate | undefined> {
    const row = await db.get<{
      id: string;
      name: string;
      subject: string;
      html_body: string;
      created_at: string;
      updated_at: string | null;
    }>('SELECT * FROM email_templates WHERE id = ?', [id]);
    return row ? this.mapRow(row) : undefined;
  }

  async findByName(name: string): Promise<EmailTemplate | undefined> {
    const row = await db.get<{
      id: string;
      name: string;
      subject: string;
      html_body: string;
      created_at: string;
      updated_at: string | null;
    }>('SELECT * FROM email_templates WHERE name = ?', [name]);
    return row ? this.mapRow(row) : undefined;
  }

  async create(data: CreateEmailTemplateInput): Promise<EmailTemplate> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.run(
      'INSERT INTO email_templates (id, name, subject, html_body, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.name.trim(), data.subject.trim(), data.htmlBody.trim(), now, now]
    );

    return {
      id,
      name: data.name.trim(),
      subject: data.subject.trim(),
      htmlBody: data.htmlBody.trim(),
      createdAt: now,
      updatedAt: now,
    };
  }

  async update(id: string, data: UpdateEmailTemplateInput): Promise<EmailTemplate | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const now = new Date().toISOString();
    const name = data.name?.trim() ?? existing.name;
    const subject = data.subject?.trim() ?? existing.subject;
    const htmlBody = data.htmlBody?.trim() ?? existing.htmlBody;

    await db.run(
      'UPDATE email_templates SET name = ?, subject = ?, html_body = ?, updated_at = ? WHERE id = ?',
      [name, subject, htmlBody, now, id]
    );

    return { id, name, subject, htmlBody, createdAt: existing.createdAt, updatedAt: now };
  }

  async delete(id: string): Promise<boolean> {
    await db.run('DELETE FROM email_templates WHERE id = ?', [id]);
    return true;
  }

  private mapRow(row: {
    id: string;
    name: string;
    subject: string;
    html_body: string;
    created_at: string;
    updated_at: string | null;
  }): EmailTemplate {
    return {
      id: row.id,
      name: row.name,
      subject: row.subject,
      htmlBody: row.html_body,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? undefined,
    };
  }
}

export const emailTemplatesRepository = new EmailTemplatesRepository();
