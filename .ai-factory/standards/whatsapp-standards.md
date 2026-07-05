# Padrões para Integração WhatsApp (OpenWA)

## 1. Sessões
- Cada sessão deve ter um nome único e descritivo (ex: suporte, endas, lertas)
- Sessões devem ser recicladas a cada 30 dias (reconexão via QR Code)
- Sessões inativas por mais de 7 dias devem ser notificadas

## 2. Mensagens
- Limite de 1000 mensagens por dia por sessão (evitar bloqueio)
- Mensagens em lote devem ter intervalo mínimo de 1 segundo entre cada envio
- Arquivos devem ser hospedados em storage S3/MinIO antes do envio
- URLs de arquivos devem ser públicas e acessíveis

## 3. Webhooks
- Todos os webhooks devem usar HMAC-SHA256 para verificação
- Webhooks devem responder em menos de 5 segundos
- Eventos devem ser registrados no memory-manager.js

## 4. Segurança
- API keys devem ser rotacionadas a cada 90 dias
- IPs não autorizados devem ser bloqueados via CIDR whitelisting
- Dados sensíveis (números de telefone, mensagens) não devem ser logados em texto puro

## 5. Monitoramento
- Health checks a cada 60 segundos
- Alertas para sessões desconectadas
- Métricas: mensagens enviadas, taxa de entrega, tempo de resposta
