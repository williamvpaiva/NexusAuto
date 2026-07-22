# Skills Registry & Governance 🧠

**Matriz de Responsabilidades de Agentes e Skills do NexusAuto**

Este documento define o escopo exato de cada skill para evitar sobreposição (overlap) e garantir que o *skill routing* direcione as tarefas para a ferramenta correta.

## 1. Code Review (Revisão de Código)

| Skill | Escopo | Gatilho (Trigger) |
|-------|--------|-------------------|
| **`code-review`** | Revisão primária de PRs, guidelines e clean code | "review code", "analise o código" |
| **`zen-review`** | (Global) Revisão avançada com modelo premium | "zen review" |
| **`zen-comprehensive-review`** | (Global) Revisão multi-modelo (consenso entre 3 IAs) | "comprehensive review" |
| **`cross-review`** | (Global) Revisão customizada com modelo específico (User-specified) | "review with X" |

*(Notas de Consolidação: A skill `code-reviewer` foi descontinuada e unificada em `code-review`. A skill `differential-review` (Security-focused) foi absorvida pelo `security-audit`)*

## 2. Documentação e Wiki

| Skill | Escopo | Gatilho (Trigger) |
|-------|--------|-------------------|
| **`documentation`** | Documentação técnica geral (API, README) | "gerar documentação" |
| **`docs-architect`** | (Global) Estruturação de manuais técnicos extensos e C4 Model | "technical manual", "architecture docs" |
| **`wiki-architect`** | (Global) Criação de índice e taxonomia para base de conhecimento | "estruturar wiki", "wiki architecture" |
| **`wiki-page-writer`** | (Global) Redação de páginas curtas e modulares baseadas em evidências | "escrever wiki", "nova página wiki" |
| **`reference-builder`** | (Global) Geração de dicionários de API exaustivos e auto-documentados | "api reference", "swagger docs" |
| **`tutorial-engineer`** | (Global) Criação de tutoriais passo-a-passo e guias de onboarding | "criar tutorial", "onboarding guide" |

*(Nota de Consolidação: A skill `documentation-writer` foi descontinuada e unificada em `documentation`)*

## 3. Segurança (Security)

| Skill | Escopo | Gatilho (Trigger) |
|-------|--------|-------------------|
| **`security-audit`** | Auditoria padrão, DevSecOps e revisões diferenciais de segurança | "security audit", "auditoria de segurança" |
| **`vulnerability-scanner`**| (Global) Scan profundo de vulnerabilidades (OWASP, injeções) | "scan vulns" |

*(Nota de Consolidação: `security-auditor` e `differential-review` foram unificadas em `security-audit`)*

## 4. Testes (QA)

| Skill | Escopo | Gatilho (Trigger) |
|-------|--------|-------------------|
| **`testing`** | Estratégias e padrões globais de testes unitários (Vitest, Jest) | "testes", "unit tests" |
| **`e2e-testing`** | (Global) Testes end-to-end simulando usuário real (Playwright) | "e2e tests", "browser tests" |

## Regra de Ouro (Routing)
**Agentes e orquestradores (como o TECH-LEAD)** devem sempre consultar este *Registry* antes de invocar uma skill. Se o escopo da tarefa for simples, prefira a skill local. Se for complexo ou demandar múltiplos modelos, utilize a skill global equivalente.
