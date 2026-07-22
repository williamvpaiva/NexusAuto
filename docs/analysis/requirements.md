# Software Requirements Specification (SRS) - NexusAuto

## Visão Geral
Este documento descreve os requisitos formais para a plataforma NexusAuto, um orquestrador de memória e automação para a fábrica de software de múltiplos agentes de IA (The Agency). O sistema visa persistir o contexto, otimizar a economia de tokens, gerenciar erros sistemáticos e permitir a orquestração segura do desenvolvimento de produtos SaaS end-to-end.

## Requisitos Funcionais (FR)
- **FR01 [Memory CRUD]:** A API REST deve permitir operações completas (Create, Read, Update, Delete) para persistência de mensagens e estado, categorizadas pelos campos cruciais (`agent_id`, `conversation_id`, `session_id`).
- **FR02 [Context Retrieval]:** O sistema deve prover endpoints dedicados para recuperar contexto histórico (handoffs). Agentes devem poder buscar "summarized history" (Layer 1) ou logs granulares dependendo da necessidade, reduzindo custo de tokens.
- **FR03 [Token Optimization Logging]:** O sistema deve extrair e registrar o tamanho estimado (ou real via meta) de tokens usados a cada iteração, gerando métricas de `token_count` no banco para relatórios financeiros.
- **FR04 [Error State Management]:** Caso a execução de um agente no fluxo falhe (ex: durante o script noturno GNHF), o sistema deve salvar o log de erro persistente com `error_code`, `stack_trace` e estado da requisição para facilitar o *debug engine* na retomada.
- **FR05 [Machine-to-Machine Authentication]:** A API deve proteger as rotas de manipulação de memória usando JWT middleware, assegurando que chamadas não autorizadas ou injeções de terceiros não corrompam o cérebro da fábrica.
- **FR06 [Monitoring Dashboard]:** O frontend em React deve possuir dashboards operacionais (`MemoryDashboard`, `HealthPage`) para consumo humano, permitindo auditoria visual dos handoffs entre os agentes, dos erros logados e da saúde (status) do sistema.

## Requisitos Não Funcionais (NFR)
- **NFR01 [Performance]:** Buscas semânticas ou consultas de handoff de memória no backend devem responder em < 100ms. Índices apropriados devem estar configurados no banco de dados SQLite (agora) e PostgreSQL (futuro).
- **NFR02 [Segurança Web]:** A API backend deve obrigatoriamente possuir camadas protetivas implementadas e operantes: Helmet (cabeçalhos HTTP seguros), CORS controlado e limites de Rate Limit se exposta externamente.
- **NFR03 [Arquitetura de Dados Modular]:** O acoplamento com o SQLite deve ser feito através de repositórios/interfaces genéricas. O projeto não deve depender de peculiaridades restritas do SQLite que inviabilizem o switch imediato para o PostgreSQL via Prisma ou raw query layer.
- **NFR04 [Observabilidade]:** Existência mandatória de uma rota GET `/api/v1/health` que prove, proativamente, a prontidão do Node.js, status de conexão do banco e métricas de SO.

## Regras de Negócio (BR)
- **BR01 [Single Source of Truth - Memória Ativa]:** Toda e qualquer decisão arquitetural (ADR) originada por agentes seniores (Tech Lead, Architect) deve ser indexada na memória persistente sob categorias "fundacionais". Agentes menores não podem contradizer memórias fundacionais.
- **BR02 [Economia Compulsória (Token Economy)]:** Memórias do log cru e conversas muito longas não devem ser injetadas por completo nas próximas requisições. O fluxo de orquestração deve forçar o uso da camada sumarizada (Layer 1) como input preferencial.
- **BR03 [V&V Gates]:** Nenhum deploy ou encerramento de milestone autônomo é considerado válido se a aplicação de saúde (Testes + Lints + Integração) e as rotas críticas de backend não retornarem status 200 OK no ambiente isolado.
