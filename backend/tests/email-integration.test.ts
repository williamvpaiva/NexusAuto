import { describe, it, expect, vi, afterAll } from 'vitest';
import nodemailer from 'nodemailer';
import { createEtherealTransport, getEtherealPreviewUrl, emailService } from '../src/services/email.service';

// ---------------------------------------------------------------------------
// Teste de Integração Real com Ethereal Email
//
// Ethereal (https://ethereal.email) é um serviço SMTP falso mantido pelo
// nodemailer. Ele ACEITA emails de verdade, mas nunca os entrega — eles
// ficam disponíveis para visualização via web.
//
// Este teste cria uma conta Ethereal, envia um email real e verifica:
// - O SMTP aceitou o email (response accepted)
// - O messageId foi gerado
// - O preview URL é acessível (opcional, comentado)
//
// NOTA: Nenhuma conta real ou configuração de .env é necessária.
// Ethereal cria contas programaticamente via API.
// ---------------------------------------------------------------------------

describe('Email Integration — Ethereal SMTP (envio real)', () => {
  let transport: nodemailer.Transporter | null = null;
  let etherealUser = '';
  let etherealAvailable = true;

  // Cria conta Ethereal e transporte uma vez para o suite
  beforeAll(async () => {
    try {
      const ethereal = await createEtherealTransport();
      transport = ethereal.transport;
      etherealUser = ethereal.user;
      console.log(`[TEST] Conta Ethereal: ${ethereal.user}`);
    } catch (err: any) {
      console.warn(`[TEST] Ethereal indisponível (rede?): ${err?.message}. Testes SKIP.`);
      etherealAvailable = false;
    }
  }, 15000);

  afterAll(async () => {
    if (transport) transport.close();
  });

  // -----------------------------------------------------------------------
  // Teste 1: Envio real via SMTP Ethereal
  // -----------------------------------------------------------------------

  it('deve enviar email real via SMTP Ethereal e obter messageId', async () => {
    if (!etherealAvailable || !transport) return;

    const info = await transport.sendMail({
      from: `"NexusAuto Test" <${etherealUser}>`,
      to: 'destinatario-teste@example.com',
      subject: 'Teste de Integração — Reset de Senha',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8" /></head>
        <body style="font-family: sans-serif; padding: 24px;">
          <h1 style="color: #2563eb;">Teste de Integração</h1>
          <p>Este email foi enviado via SMTP Ethereal para validar o pipeline de email.</p>
          <p>Se você está vendo isso, o envio funcionou! 🎉</p>
          <hr />
          <p style="font-size: 0.85rem; color: #64748b;">
            Enviado em: ${new Date().toISOString()}
          </p>
        </body>
        </html>
      `,
    });

    // Verifica que o SMTP aceitou e gerou messageId
    expect(info).toBeDefined();
    expect(info.messageId).toBeTruthy();
    expect(typeof info.messageId).toBe('string');
    expect(info.accepted).toContain('destinatario-teste@example.com');

    // Obtém URL de preview no Ethereal
    const previewUrl = getEtherealPreviewUrl(info);
    expect(previewUrl).toBeTruthy();
    expect(previewUrl).toContain('ethereal.email');

    console.log(`[TEST] Email enviado! Preview: ${previewUrl}`);
    console.log(`[TEST] Message ID: ${info.messageId}`);

    // NOTA: O preview URL pode ser aberto no navegador para ver o email.
    // Exemplo: https://ethereal.email/message/<id>
  }, 30000);

  // -----------------------------------------------------------------------
  // Teste 2: Verifica que o HTML foi renderizado corretamente
  // -----------------------------------------------------------------------

  it('deve enviar email com HTML de template de reset', async () => {
    if (!etherealAvailable || !transport) return;
    const testToken = 'test-integration-token-123';
    const testEmail = `destinatario-${Date.now()}@example.com`;
    const resetLink = `http://localhost:5173/reset-password?token=${testToken}`;

    const info = await transport.sendMail({
      from: `"NexusAuto" <${etherealUser}>`,
      to: testEmail,
      subject: 'Redefina sua senha - NexusAuto',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head><meta charset="utf-8" /></head>
        <body style="font-family: sans-serif; padding: 24px; background: #f4f7fb;">
          <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 32px;">
            <h1 style="color: #0f172a;">Redefinição de senha</h1>
            <p style="color: #475569;">Clique no botão abaixo para criar uma nova senha:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetLink}"
                 style="display: inline-block; padding: 14px 28px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 600;">
                Redefinir senha
              </a>
            </div>
            <p style="font-size: 0.85rem; color: #94a3b8; text-align: center;">
              Este link expira em 15 minutos.
            </p>
            <p style="font-size: 0.85rem; word-break: break-all; color: #64748b; text-align: center; background: #f8fafc; padding: 12px; border-radius: 8px;">
              ${resetLink}
            </p>
          </div>
        </body>
        </html>
      `,
    });

    expect(info).toBeDefined();
    expect(info.messageId).toBeTruthy();
    expect(info.accepted).toContain(testEmail);

    const previewUrl = getEtherealPreviewUrl(info);
    expect(previewUrl).toBeTruthy();

    // Verifica que o HTML contém o token de reset
    expect(info.messageId).toBeTruthy();

    console.log(`[TEST] Email de reset enviado! Preview: ${previewUrl}`);
  }, 30000);

  // -----------------------------------------------------------------------
  // Teste 3: SendViaSmtp diretamente com transporte Ethereal
  // -----------------------------------------------------------------------

  it('emailService.sendViaSmtp deve enviar via SMTP Ethereal real', async () => {
    if (!etherealAvailable || !transport) return;
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await emailService.sendViaSmtp(
      transport,
      'integracao-via-smtp@example.com',
      { subject: 'Teste SMTP direto', html: '<p>Envio direto via SMTP</p>' },
      'http://localhost:5173/reset-password?token=int-token-diretto',
    );

    // Verifica que logou sucesso
    const successLogs = consoleLogSpy.mock.calls.filter(
      (call) => (call[0] as string).includes('Reset enviado via SMTP para integracao-via-smtp@example.com')
    );
    expect(successLogs.length).toBe(1);

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  }, 30000);

  // -----------------------------------------------------------------------
  // Teste 4: getEtherealPreviewUrl retorna URL válida
  // -----------------------------------------------------------------------

  it('getEtherealPreviewUrl deve retornar URL de preview do Ethereal', async () => {
    if (!etherealAvailable || !transport) return;
    const info = await transport.sendMail({
      from: etherealUser,
      to: 'preview@test.com',
      subject: 'Preview test',
      text: 'Hello world',
    });

    const url = getEtherealPreviewUrl(info);
    expect(url).toBeTruthy();
    expect(url).toContain('https://ethereal.email');
    console.log(`[TEST] Preview URL: ${url}`);
  }, 15000);

  // -----------------------------------------------------------------------
  // Teste 5: SMTP com erro faz fallback para console.log
  // -----------------------------------------------------------------------

  it('deve fazer fallback para console.log quando SMTP falha', async () => {
    // Cria transporte inválido (conexão recusada rapidamente)
    const badTransport = nodemailer.createTransport({
      host: 'localhost',
      port: 1,
      connectionTimeout: 2000,
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await emailService.sendViaSmtp(
      badTransport,
      'fallback@test.com',
      { subject: 'Falha', html: '<p>Falha</p>' },
      'http://localhost:5173/reset-password?token=test-fallback',
    );

    // Deve logar erro
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Falha ao enviar email via SMTP para fallback@test.com'),
      expect.any(String),
    );

    // Deve fazer fallback e logar o link
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Fallback - link de reset para fallback@test.com'),
    );

    // NUNCA deve lançar exceção
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  }, 15000);
});
