import { AppError, NotFoundError } from '../utils/app-error';
import type { IEmailTemplatesRepository } from '../repositories/interfaces/IEmailTemplatesRepository';
import { emailTemplatesRepository } from '../repositories/email-templates.repository';
import type { CreateEmailTemplateInput, UpdateEmailTemplateInput, EmailTemplate } from '../repositories/email-templates.repository';

// ---------------------------------------------------------------------------
// Template padrão (fallback quando o template não existe no DB)
// ---------------------------------------------------------------------------

const DEFAULT_RESET_TEMPLATE: EmailTemplate = {
  id: 'builtin-default',
  name: 'reset-password',
  subject: 'Redefina sua senha - NexusAuto',
  htmlBody: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background-color: #f4f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 480px; margin: 0 auto; padding: 24px; }
    .card { background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06); }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo-text { font-size: 1.5rem; font-weight: 700; color: #0f172a; }
    h1 { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; text-align: center; }
    p { color: #475569; font-size: 0.95rem; line-height: 1.6; margin: 0 0 16px 0; }
    .btn { display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 1rem; margin: 8px 0; text-align: center; }
    .btn-container { text-align: center; margin: 24px 0; }
    .footer { text-align: center; color: #94a3b8; font-size: 0.8rem; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
    .footer a { color: #94a3b8; text-decoration: underline; }
    .expiry { font-size: 0.85rem; color: #94a3b8; text-align: center; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <span class="logo-text">NexusAuto</span>
      </div>
      <h1>Redefinição de senha</h1>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:</p>
      <div class="btn-container">
        <a href="{{RESET_LINK}}" class="btn" target="_blank">Redefinir senha</a>
      </div>
      <p>Se você não solicitou esta alteração, ignore este email. Nenhuma alteração será feita na sua conta.</p>
      <p class="expiry">Este link expira em 15 minutos.</p>
      <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
      <p style="font-size: 0.85rem; word-break: break-all; color: #64748b; text-align: center; background: #f8fafc; padding: 12px; border-radius: 8px;\">{{RESET_LINK}}</p>
    </div>
    <div class="footer">
      <p>NexusAuto &mdash; Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>`,
  createdAt: new Date().toISOString(),
};

// ---------------------------------------------------------------------------
// Templates Service
// ---------------------------------------------------------------------------

export class EmailTemplatesService {
  constructor(private emailTemplatesRepo: IEmailTemplatesRepository) {}

  async list(): Promise<EmailTemplate[]> {
    return this.emailTemplatesRepo.findAll();
  }

  async findById(id: string): Promise<EmailTemplate> {
    const template = await this.emailTemplatesRepo.findById(id);
    if (!template) {
      throw new NotFoundError('Template de email');
    }
    return template;
  }

  async create(data: CreateEmailTemplateInput): Promise<EmailTemplate> {
    const existing = await this.emailTemplatesRepo.findByName(data.name.trim());
    if (existing) {
      throw new AppError('Já existe um template com este nome', 409, 'TEMPLATE_NAME_EXISTS');
    }
    return this.emailTemplatesRepo.create(data);
  }

  async update(id: string, data: UpdateEmailTemplateInput): Promise<EmailTemplate> {
    if (data.name) {
      const existing = await this.emailTemplatesRepo.findByName(data.name.trim());
      if (existing && existing.id !== id) {
        throw new AppError('Já existe um template com este nome', 409, 'TEMPLATE_NAME_EXISTS');
      }
    }
    const updated = await this.emailTemplatesRepo.update(id, data);
    if (!updated) {
      throw new NotFoundError('Template de email');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    if (id === 'reset-password-default') {
      throw new AppError('O template padrão não pode ser removido', 400, 'CANNOT_DELETE_DEFAULT');
    }
    const template = await this.emailTemplatesRepo.findById(id);
    if (!template) {
      throw new NotFoundError('Template de email');
    }
    await this.emailTemplatesRepo.delete(id);
  }

  async render(name: string, variables: Record<string, string>): Promise<{ subject: string; html: string }> {
    let template = await this.emailTemplatesRepo.findByName(name);

    if (!template) {
      template = DEFAULT_RESET_TEMPLATE;
    }

    let subject = template.subject;
    let html = template.htmlBody;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replaceAll(placeholder, value);
      html = html.replaceAll(placeholder, value);
    }

    return { subject, html };
  }
}

export const emailTemplatesService = new EmailTemplatesService(emailTemplatesRepository);
