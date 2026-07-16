import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock env (usando vi.hoisted para evitar ReferenceError de hoisting)
// ---------------------------------------------------------------------------

const mockEnv = vi.hoisted(() => ({
  frontendOrigin: 'http://localhost:5173',
  resendApiKey: '',
  emailFrom: 'noreply@test.com',
}));

vi.mock('../src/config/env', () => ({
  env: mockEnv,
}));

// ---------------------------------------------------------------------------
// Mock do Resend SDK
// ---------------------------------------------------------------------------

const mockResendSend = vi.hoisted(() => vi.fn());

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: mockResendSend },
  })),
}));

// ---------------------------------------------------------------------------
// Import após mocks
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mock do email-templates service (evita query em DB que não existe em testes)
// ---------------------------------------------------------------------------

const mockRender = vi.hoisted(() => vi.fn().mockImplementation(async (_name: string, vars: Record<string, string>) => ({
  subject: 'Redefina sua senha - Polymarketing',
  html: `<html><body><a href="${vars.RESET_LINK}">Resetar</a></body></html>`,
})));

vi.mock('../src/services/email-templates.service', () => ({
  emailTemplatesService: {
    render: mockRender,
  },
}));

import { emailService } from '../src/services/email.service';
import { env } from '../src/config/env';

describe('emailService.sendResetPasswordEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.resendApiKey = '';
    mockResendSend.mockReset();
  });

  it('should log reset link in dev mode (no API key)', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await emailService.sendResetPasswordEmail({
      to: 'user@test.com',
      token: 'abc123token',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Modo dev - link de reset para user@test.com')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('/reset-password?token=abc123token')
    );
  });

  it('should use correct reset link format', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await emailService.sendResetPasswordEmail({
      to: 'test@example.com',
      token: 'my-reset-token-123',
    });

    const logCall = consoleSpy.mock.calls.find((call: unknown[]) =>
      (call[0] as string).includes('Modo dev')
    );
    expect(logCall).toBeDefined();
    expect(logCall![0] as string).toContain('http://localhost:5173/reset-password?token=my-reset-token-123');
  });

  it('should send via Resend when API key is set and log success', async () => {
    mockEnv.resendApiKey = 're_abc123';
    mockResendSend.mockResolvedValue({ id: 'email-id-1' });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await emailService.sendResetPasswordEmail({
      to: 'admin@test.com',
      token: 'reset-token-456',
    });

    expect(mockResendSend).toHaveBeenCalledTimes(1);
    expect(mockResendSend).toHaveBeenCalledWith({
      from: 'noreply@test.com',
      to: 'admin@test.com',
      subject: expect.stringContaining('Redefina sua senha'),
      html: expect.stringContaining('reset-token-456'),
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Reset enviado para admin@test.com')
    );
  });

  it('should handle Resend API errors gracefully (fallback to log)', async () => {
    mockEnv.resendApiKey = 're_error_key';
    mockResendSend.mockRejectedValue(new Error('API rate limit exceeded'));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await emailService.sendResetPasswordEmail({
      to: 'error@test.com',
      token: 'error-token-789',
    });

    // Deve logar o erro
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Falha ao enviar email para error@test.com'),
      expect.any(String)
    );

    // Deve fazer fallback e logar o link
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Fallback - link de reset para error@test.com')
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('/reset-password?token=error-token-789')
    );
  });

  it('should never throw any error', async () => {
    await expect(
      emailService.sendResetPasswordEmail({
        to: 'any@test.com',
        token: 'some-token',
      })
    ).resolves.toBeUndefined();
  });

  it('should include the token in the reset link', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await emailService.sendResetPasswordEmail({
      to: 'test@test.com',
      token: 'unique-token-789',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('unique-token-789')
    );
  });

  it('should use the frontend origin from env', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const originalOrigin = mockEnv.frontendOrigin;
    mockEnv.frontendOrigin = 'https://app.polymarketing.com.br';

    await emailService.sendResetPasswordEmail({
      to: 'user@test.com',
      token: 'token-xyz',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://app.polymarketing.com.br/reset-password?token=token-xyz')
    );

    mockEnv.frontendOrigin = originalOrigin;
  });
});
