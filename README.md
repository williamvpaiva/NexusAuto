# NexusAuto / Polymarketing

> Assistente de marketing inteligente com orquestração autônoma por agentes de IA.

Este projeto é um **sistema de marketing aumentado por IA** — uma plataforma full stack (React + Express + SQLite) que integra agentes especializados para análise de dados, criação de conteúdo SEO, gestão de redes sociais e automação de campanhas. A inteligência do sistema é orquestrada pelo **TECH-LEAD.md**, que deve ser invocado sempre que novos arquivos forem adicionados ao projeto.

---

## Fluxo de Trabalho

```
1. Coloque os arquivos no diretório do projeto
2. Invoque TECH-LEAD.md (via Claude, Cursor, Copilot, etc.)
3. O TECH-LEAD orquestra tudo automaticamente
```

Não há interface — o projeto funciona 100% via arquivos e agentes de IA.

---

## Estrutura do Projeto

```
nexusauto/
├── .ai-factory/              # Núcleo de agentes e orquestração
│   ├── agents/               # 10 agentes especializados (tech-lead, po, devs, etc)
│   ├── skills/               # Habilidades transversais dos agentes
│   ├── standards/            # Padrões obrigatórios de código e testes
│   ├── workflows/            # Fluxos: new-feature, bugfix
│   ├── handoffs/             # Regras de transição entre agentes
│   ├── prompts/              # Prompts reutilizáveis
│   ├── templates/            # Templates para tarefas
│   ├── checklists/           # Checklists de qualidade
│   ├── scripts/              # Scripts de automação (auto-analyze, init)
│   ├── logs/                 # Logs de execução
│   ├── token-manager/        # Gerenciamento de tokens
│   ├── MELHORIAS/            # 22 áreas de melhoria contínua com tarefas
│   │   ├── INDEX.md          # Dashboard com progresso por área
│   │   ├── 01-ARQUITETURA/   # Tarefas de arquitetura
│   │   ├── 08-SEGURANCA/     # Tarefas de segurança
│   │   ├── 09-TESTES/        # Tarefas de testes
│   │   └── ...               # Total: 22 áreas
│   ├── ORCHESTRATOR.md       # Como usar a fábrica de software
│   ├── PROJECT_CONTEXT.md    # Contexto completo do projeto
│   └── PROGRESS.md           # Registro de progresso
│
├── backend/                  # API REST (Express + TypeScript)
│   └── src/
│       ├── config/           # Configurações (env, database)
│       ├── controllers/      # Controladores (memory, users)
│       ├── middleware/        # Error handler
│       ├── repositories/     # Acesso a dados (SQLite)
│       ├── routes/           # Rotas (health, users, memory)
│       ├── services/         # Lógica de negócio
│       ├── types/            # Tipos TypeScript
│       └── utils/            # Utilitários (AppError)
│
├── frontend/                 # SPA React (Vite + TypeScript)
│   └── src/
│       ├── components/       # Layout, MemoryList
│       ├── pages/            # HomePage, HealthPage, MemoryDashboard
│       ├── lib/              # API client
│       └── styles/           # CSS global
│
├── docs/                     # Documentação
│   └── adr/                  # Architecture Decision Records
│
├── .github/
│   └── workflows/            # CI/CD (GitHub Actions)
│
├── scripts/                  # Scripts utilitários
├── docker-compose.yml        # PostgreSQL + Redis
├── TECH-LEAD.md              # → ORQUESTRADOR PRINCIPAL ←
├── AI-FACTORY.md             # Visão geral da fábrica de IA
├── SETUP.md                  # Guia de instalação
└── package.json              # Monorepo root
```

---

## Como Executar

```bash
# 1. Coloque os arquivos do projeto no diretório
# 2. Invoque o TECH-LEAD.md no seu agente de IA favorito
#    (Claude Code, Cursor, Copilot, Gemini, etc.)
# 3. O TECH-LEAD orquestra automaticamente todos os agentes
```

> O projeto funciona 100% via arquivos markdown e agentes de IA — não há interface gráfica tradicional.

### Fluxo Detalhado

1. **Contextualização** → TECH-LEAD.md lê o contexto do projeto e identifica o que precisa ser feito
2. **Orquestração** → O tech-lead delega tarefas para agentes especializados (architect, backend-dev, frontend-dev, security, etc.)
3. **Execução** → Cada agente executa sua tarefa seguindo os padrões definidos em `.ai-factory/standards/`
4. **Validação** → QA e segurança revisam o resultado antes de finalizar

---

## Stack

| Camada       | Tecnologia                                         |
|-------------|----------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite, React Router           |
| Backend     | Node.js, Express, TypeScript, Zod, SQLite, Vitest  |
| Infra       | Docker Compose (PostgreSQL 15, Redis 7 opcionais)  |
| CI/CD       | GitHub Actions                                     |

---



## Agentes da AI Factory

| Agente           | Responsabilidade                          |
|-----------------|-------------------------------------------|
| `tech-lead`     | Orquestração geral e decisões técnicas    |
| `product-owner` | Definição de problema e prioridade        |
| `analyst`       | Levantamento de requisitos                |
| `architect`     | Design de arquitetura                     |
| `frontend-dev`  | Desenvolvimento frontend                  |
| `backend-dev`   | Desenvolvimento backend                   |
| `security`      | Auditoria de segurança                    |
| `performance`   | Otimização de performance                 |
| `qa-tester`     | Garantia de qualidade                     |
| `devops`        | Deploy e operação                         |

---

## Melhoria Contínua

O diretório `.ai-factory/MELHORIAS/` contém 22 áreas de melhoria com tarefas para evolução contínua do projeto:

| # | Área                           | Prioridade |
|---|-------------------------------|------------|
| 01 | Arquitetura                   | Alta       |
| 02 | Debugging                     | Alta       |
| 03 | Sistemas                      | Alta       |
| 04 | Performance                   | Alta       |
| 05 | Clean Architecture            | Média      |
| 06 | Multiagente                   | Média      |
| 07 | UI Components                 | Média      |
| 08 | Segurança                     | Alta       |
| 09 | Testes                        | Alta       |
| 10 | CI/CD                         | Média      |
| 11 | Documentação                  | Média      |
| 12 | Banco de Dados                | Alta       |
| 13 | Monitoramento                 | Média      |
| 14 | Acessibilidade                | Baixa      |
| 15 | SEO e Analytics               | Média      |
| 16 | Gestão de Erros               | Alta       |
| 17 | Gestão de Estado              | Média      |
| 18 | API e Integrações             | Alta       |
| 19 | Onboarding e DX               | Média      |
| 20 | Compliance e LGPD             | Baixa      |
| 21 | Limpeza e Housekeeping        | Baixa      |
| 22 | Pentest e Seg. Avançada       | Baixa      |

---