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
