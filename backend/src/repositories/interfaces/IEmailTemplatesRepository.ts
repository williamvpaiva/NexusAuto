import type { EmailTemplate, CreateEmailTemplateInput, UpdateEmailTemplateInput } from '../email-templates.repository';

export interface IEmailTemplatesRepository {
  findAll(): Promise<EmailTemplate[]>;
  findById(id: string): Promise<EmailTemplate | undefined>;
  findByName(name: string): Promise<EmailTemplate | undefined>;
  create(data: CreateEmailTemplateInput): Promise<EmailTemplate>;
  update(id: string, data: UpdateEmailTemplateInput): Promise<EmailTemplate | undefined>;
  delete(id: string): Promise<boolean>;
}
