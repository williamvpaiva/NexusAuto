import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { emailTemplatesService, type EmailTemplatesService } from './email-templates.service';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface SendResetEmailParams {
  to: string;
  token: string;
}

// ---------------------------------------------------------------------------
// Clientes lazy singleton
// ---------------------------------------------------------------------------

let resendClient: Resend | null = null;
let smtpTransport: nodemailer.Transporter | null = null;

function getResendClient(): Resend | null {
  if (!env.resendApiKey) {
    resendClient = null;
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(env.resendApiKey);
  }
  return resendClient;
}

function getSmtpTransport(): nodemailer.Transporter | null {
  if (!env.smtpHost) {
    smtpTransport = null;
    return null;
  }
  if (!smtpTransport) {
    smtpTransport = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: env.smtpUser && env.smtpPass
        ? { user: env.smtpUser, pass: env.smtpPass }
        : undefined,
    });
  }
  return smtpTransport;
}

/**
 * Cria um transporte SMTP de teste via Ethereal (nodemailer).
 * Usado em testes de integração para validar o envio real.
 */
export async function createEtherealTransport(): Promise<{
  transport: nodemailer.Transporter;
  user: string;
  pass: string;
  webUrl: string;
}> {
  const testAccount = await nodemailer.createTestAccount();
  const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return {
    transport,
    user: testAccount.user,
    pass: testAccount.pass,
    webUrl: 'https://ethereal.email/login',
  };
}

// ---------------------------------------------------------------------------
// Email Service
// ---------------------------------------------------------------------------

export class EmailService {
  constructor(private emailTemplatesSvc: EmailTemplatesService) {}

  /**
   * Envia email de redefinição de senha.
   *
   * Estratégia de envio (em ordem de precedência):
   * 1. Resend (se RESEND_API_KEY configurada)
   * 2. SMTP (se SMTP_HOST configurado)
   * 3. Console log (modo dev, fallback padrão)
   *
   * NUNCA lança exceções — erros são logados e o fluxo continua.
   */
  async sendResetPasswordEmail(params: SendResetEmailParams): Promise<void> {
    const resetLink = `${env.frontendOrigin}/reset-password?token=${params.token}`;
    const rendered = await this.renderResetEmailHtml(resetLink);

    // 1. Tenta Resend primeiro
    const resend = getResendClient();
    if (resend) {
      await this.sendViaResend(resend, params.to, rendered, resetLink);
      return;
    }

    // 2. Tenta SMTP
    const smtp = getSmtpTransport();
    if (smtp) {
      await this.sendViaSmtp(smtp, params.to, rendered, resetLink);
      return;
    }

    // 3. Dev fallback: loga o link
    console.log(`[EMAIL] Modo dev - link de reset para ${params.to}: ${resetLink}`);
  }

  /**
   * Envia via Resend API.
   * Em caso de erro, faz fallback para console.log.
   */
  async sendViaResend(
    client: Resend,
    to: string,
    rendered: { subject: string; html: string },
    resetLink: string,
  ): Promise<void> {
    try {
      await client.emails.send({
        from: env.emailFrom,
        to,
        subject: rendered.subject,
        html: rendered.html,
      });
      console.log(`[EMAIL] Reset enviado para ${to}`);
    } catch (err: any) {
      console.error(`[EMAIL] Falha ao enviar email para ${to}:`, err?.message);
      console.log(`[EMAIL] Fallback - link de reset para ${to}: ${resetLink}`);
    }
  }

  /**
   * Envia via SMTP (Nodemailer).
   * Em caso de erro, faz fallback para console.log.
   */
  async sendViaSmtp(
    transport: nodemailer.Transporter,
    to: string,
    rendered: { subject: string; html: string },
    resetLink: string,
  ): Promise<void> {
    try {
      const info = await transport.sendMail({
        from: env.emailFrom,
        to,
        subject: rendered.subject,
        html: rendered.html,
      });
      console.log(`[EMAIL] Reset enviado via SMTP para ${to}`);
      if (info.messageId) {
        console.log(`[EMAIL] Message ID: ${info.messageId}`);
      }
    } catch (err: any) {
      console.error(`[EMAIL] Falha ao enviar email via SMTP para ${to}:`, err?.message);
      console.log(`[EMAIL] Fallback - link de reset para ${to}: ${resetLink}`);
    }
  }

  private async renderResetEmailHtml(resetLink: string): Promise<{ subject: string; html: string }> {
    return this.emailTemplatesSvc.render('reset-password', { RESET_LINK: resetLink });
  }
}

export const emailService = new EmailService(emailTemplatesService);

/**
 * Utilitário para obter URL de preview do Ethereal.
 * Pode ser chamado após sendMail() com nodemailer para visualizar o email enviado.
 */
export function getEtherealPreviewUrl(info: nodemailer.SentMessageInfo): string | null {
  return nodemailer.getTestMessageUrl(info) || null;
}
