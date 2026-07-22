import { logger } from '../utils/logger';

interface AlertContext {
  alertName: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: string;
}

export class AlertService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL || '';
  }

  async sendAlert(context: AlertContext): Promise<void> {
    const payload = {
      text: `🚨 *ALERTA NEXUSAUTO* 🚨\n*Nome:* ${context.alertName}\n*Métrica:* ${context.metric}\n*Valor Atual:* ${context.value} (Limite: ${context.threshold})\n*Data:* ${context.timestamp}`,
    };

    logger.warn({ alert: context }, 'Disparando alerta de monitoramento');

    if (!this.webhookUrl) {
      logger.debug('SLACK_WEBHOOK_URL não configurada. Alerta registrado apenas no log.');
      return;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        logger.error({ status: response.status }, 'Falha ao enviar alerta para Webhook');
      } else {
        logger.info('Alerta enviado com sucesso para Webhook');
      }
    } catch (error) {
      logger.error({ err: error }, 'Erro de rede ao enviar alerta para Webhook');
    }
  }
}

export const alertService = new AlertService();
