# Spec: Automação de Vendas/Leads (Captação e Roteamento)

## Visão Geral
Implementar o motor principal de captação de Leads e orquestração de vendas. O sistema deve ser capaz de receber leads de múltiplas fontes (Webhook, API direta), classificar a temperatura do lead e atribuir a um vendedor com base em regras de roteamento (ex: Round Robin ou por especialidade).

## Requisitos Funcionais
1. **Captação (Ingestion)**: Endpoint `POST /api/leads/webhook` para entrada de dados padronizada (Nome, Telefone, Email, Fonte, Interesse).
2. **Qualificação Automática**: Regra de negócio simples para setar o score do lead baseado nos dados preenchidos.
3. **Atribuição (Routing)**: Distribuição automática para usuários da role `SALES`.
4. **Notificação**: (Opcional/Mock) Disparo de evento que pode ser consumido para notificar o vendedor (ex: envio de webhook para o Slack ou WAHA).

## Arquitetura
- **Banco de Dados (Prisma)**:
  - Model `Lead`: id, name, phone, email, source, status, score, assignedToId (fk User), createdAt, updatedAt.
- **Camada de Serviço (`lead.service.ts`)**: Lógica de atribuição Round Robin.
- **Camada de Rota (`lead.routes.ts`)**: CRUD básico de Leads e endpoint de captação de webhook.
- **Integração Auth**: Utilização do RBAC, onde apenas `SALES`, `MANAGER` e `ADMIN` podem visualizar a fila de leads.

## Critérios de Aceite (V&V)
- Webhooks de captação sem autenticação devem aceitar um `x-api-key` válido.
- O lead deve obrigatoriamente ser salvo com uma Fonte (Source) válida.
- Ao salvar um lead sem vendedor, o sistema deve automaticamente buscar o próximo vendedor disponível e atribuir.
- Testes de integração garantindo que o Webhook responde rapidamente (200 OK) e processa os dados corretamente.
