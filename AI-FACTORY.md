# AI Factory - Visão Geral

## The Agency – Perfis de Especialistas

O módulo The Agency gerencia uma coleção de perfis detalhados de especialistas em IA. Cada perfil define uma personalidade, voz, habilidades técnicas e exemplos de uso.

**Localização:** `.ai-factory/the-agency/profiles/`

**Como usar:**
- `/agency-list` – Lista todos os perfis disponíveis.
- `/agency-load "nome"` – Carrega um perfil como contexto para o agente atual.
- `/agency-search "termo"` – Busca perfis por habilidades ou tags.

**Benefícios:**
- Enriquecimento de contexto para agentes existentes.
- Padronização de personalidades e vozes para tarefas específicas.
- Facilidade para criar novos especialistas sob demanda.

## Memória Automática de Longo Prazo

O sistema de memória automática elimina a necessidade de repetir o contexto do projeto para os agentes. Ele captura continuamente as atividades e cria sumários acessíveis.

**Componentes:**
- **Watcher (`.ai-factory/scripts/memory-watcher.js`):** Monitora arquivos alterados e comandos de shell executados, injetando eventos na memória persistente.
- **Summarizer (`.ai-factory/scripts/memory-summarizer.js`):** Comprime históricos longos de eventos (geralmente gerados pelo watcher) em resumos inteligentes utilizando IA.
- **API (`.ai-factory/scripts/memory-api.js` e backend):** Expõe as memórias (busca semântica, paginação) via REST e Server-Sent Events (SSE).
- **Dashboard Web (`.ai-factory/web/memory-dashboard/`):** Interface local para gerenciar memórias, marcá-las como privadas ou buscar eventos antigos.

**Como usar:**
- `/memory-watch` – Inicia o watcher em background.
- `/memory-summarize` – Gera um resumo imediato das atividades recentes.
- `/memory-dashboard` – Abre a interface de visualização.
- Na inicialização de uma nova sessão, o **SessionStart Hook** injeta o último resumo automaticamente no contexto.

## TencentDB Agent Memory

O NexusAuto integra o TencentDB Agent Memory como uma camada complementar de memória hierárquica.

- **Short-term symbolic memory**: Logs pesados são descarregados para canvas Mermaid, mantendo apenas símbolos no contexto, economizando até 61% de tokens.
- **Long-term hierarchical memory**: Persona (L3), Cenários (L2), Átomos (L1) e Conversação (L0) – armazenados em Markdown (L3/L2) e SQLite (L1/L0).
- **Hybrid search**: BM25 + vetor + RRF para recuperação precisa.
- **Rastreabilidade**: Caminho determinístico com `node_id` para drill-down.

Comandos disponíveis: `/memory-canvas`, `/memory-drill`, `/memory-persona`, `/memory-scenarios`, `/memory-conversation`, `/memory-search`.

## OpenWiki + GNHF Integration

O NexusAuto agora integra ferramentas de documentação automática e execução autônoma de agentes.

### OpenWiki (`.ai-factory/tools/openwiki/`)

**Propósito:** Gerar e manter documentação automática para agentes de IA.

**Comandos:**
- `/wiki init` – Inicializa wiki em `.ai-factory/wiki/`
- `/wiki update` – Atualiza docs baseado em mudanças recentes
- `node .ai-factory/tools/openwiki/openwiki.js --update`

**GitHub Actions:** PR automático diário às 03:00 UTC

### GNHF (`.ai-factory/tools/gnhf/`)

**Propósito:** Executar agentes autônomos overnight com validação V&V.

**Comandos:**
- `/gnhf run "objetivo"` – Executa loop autônomo
- `/gnhf status` – Verifica status de runs
- `node .ai-factory/tools/gnhf/gnhf.js "objetivo" --max-iterations 10`

**Features:**
- Validação V&V de 7 passos como gate pré-commit
- Handoffs automáticos em `.ai-factory/handoffs/`
- Worktrees para múltiplos agentes simultâneos
- Rollback em falha

**GitHub Actions:** Run automático diário às 02:00 UTC

### Validação V&V (`.ai-factory/scripts/run-vv.js`)

**Propósito:** Gate de qualidade de 7 passos antes de commit.

**Passos:**
1. Sintaxe e Type Checking
2. Testes Unitários
3. Testes de Integração
4. Security Scan
5. Performance Check
6. Code Style & Linting
7. Documentation Check

**Comando:** `/vv run` ou `node .ai-factory/scripts/run-vv.js`

### Memory Integration (`.ai-factory/scripts/memory-integration.js`)

**Propósito:** Conectar memória hierárquica com OpenWiki e GNHF.

**Comandos:**
- `/memory sync` – Sincroniza memória com Wiki
- `node .ai-factory/scripts/memory-integration.js sync`

### Integração Completa

**Comando:** `/integrate full` ou `node .ai-factory/scripts/integrate.js`

Executa: OpenWiki → GNHF → Memory Sync → V&V

**Testes:** `node .ai-factory/scripts/test-integration.js`
