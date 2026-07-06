# Key Decisions - NexusAuto

## Decisões Arquiteturais (ADRs)

### ADR-001: SQLite com sqlite-vec para Memória Vetorial
**Data:** 2026-01-04  
**Status:** Aprovado  
**Contexto:** Precisávamos de uma solução de memória de longo prazo com busca semântica que fosse:
- Local (sem custos de API)
- Leve (sem infraestrutura adicional)
- Rápida (consultas em milissegundos)

**Decisão:** Utilizar SQLite com extensão sqlite-vec para armazenar embeddings e fazer buscas por similaridade.

**Alternativas consideradas:**
- Pinecone/Weaviate: Custo mensal, infraestrutura externa
- pgvector: Requer PostgreSQL rodando
- Chroma: Mais complexo, dependência adicional

**Consequências:**
- ✅ Zero custos de infraestrutura
- ✅ Embeddings locais com @xenova/transformers
- ✅ Cache automático de respostas
- ⚠️ Necessidade de gerenciar migrations do banco

---

### ADR-002: Slash Commands para Interação Humana
**Data:** 2026-01-04  
**Status:** Aprovado  
**Contexto:** Interação com o Tech Lead precisava ser padronizada e econômica em tokens.

**Decisão:** Implementar comandos no formato `/nl-*` no TECH-LEAD.md:
- `/nl-standup` - Resumo do status atual (≤200 tokens)
- `/nl-log-decision "texto"` - Registra decisão
- `/nl-session-start` - Carrega contexto essencial
- `/nl-retrospective` - Análise de sprint
- `/nl-brag "conquista"` - Registra win
- `/nl-search "termo"` - Busca semântica

**Consequências:**
- ✅ Interação padronizada
- ✅ Economia de tokens (comandos curtos)
- ✅ Logs estruturados automaticamente

---

### ADR-003: Estrutura Obsidian Mind
**Data:** 2026-01-04  
**Status:** Aprovado  
**Contexto:** Organizar memória e templates seguindo padrão consolidado.

**Decisão:** Criar diretórios `brain/`, `org/`, `bases/` dentro de `.ai-factory/` com wikilinks ([[caminho/para/arquivo]]).

**Consequências:**
- ✅ Grafo de conhecimento navegável
- ✅ Compatível com Obsidian (Graph View, Dataview)
- ✅ Templates reutilizáveis

---

### ADR-004: Token Budget com Limite de 50k Tokens
**Data:** 2026-01-04  
**Status:** Aprovado  
**Contexto:** Tarefas grandes estavam consumindo tokens excessivos sem divisão adequada.

**Decisão:** Implementar scripts/token-budget.js que:
- Conta tokens com tiktoken
- Retorna SPLIT_REQUIRED se exceder 50k tokens
- Cria subtarefas em tasks-split/

**Consequências:**
- ✅ Controle de custos
- ✅ Tarefas dividas automaticamente
- ⚠️ Overhead de divisão de contexto

---

### ADR-005: Skills Padronizadas com SKILL.md
**Data:** 2026-01-04  
**Status:** Aprovado  
**Contexto:** Habilidades dos agentes eram instruções avulsas sem padronização.

**Decisão:** Criar diretório `.ai-factory/skills/` com arquivos SKILL.md contendo frontmatter YAML.

**Consequências:**
- ✅ Descobrimento automático de skills
- ✅ Carregamento progressivo (apenas relevantes)
- ✅ Rastreabilidade de uso

---

## Decisões Pendentes
- [ ] Integração com Composio para ações externas (GitHub, Slack, Jira)
- [ ] Estratégia de backup para banco SQLite
- [ ] Política de retenção de memórias (TTL?)

## Como Adicionar Nova Decisão
1. Copie o template acima
2. Preencha Contexto, Decisão, Alternativas, Consequências
3. Adicione link em [[brain/North Star]] se relevante
4. Execute `/nl-log-decision "resumo"` para registrar na memória vetorial
- **ADR-2026-07-06**: Test CLI decision logging via nl.js wrapper (2026-07-06 15:43:32)