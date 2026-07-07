# NexusAuto - Integração OpenWiki + GNHF

## Visão Geral

Esta documentação descreve a integração das ferramentas **OpenWiki** e **GNHF** com a estrutura existente do NexusAuto AI Factory.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    NexusAuto AI Factory                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │  OpenWiki    │◄────►│   Memória    │◄────►│   GNHF    │ │
│  │  (Docs)      │      │  Hierárquica │      │ (Agentes) │ │
│  └──────┬───────┘      └──────┬───────┘      └─────┬─────┘ │
│         │                     │                     │       │
│         ▼                     ▼                     ▼       │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │  .ai-factory │      │  SQLite +    │      │  V&V      │ │
│  │  /wiki/      │      │  Vector      │      │  (7 steps)│ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Componentes

### 1. OpenWiki (`.ai-factory/tools/openwiki/`)

**Propósito:** Gerar e manter documentação automática para agentes de IA.

**Comandos:**
```bash
# Inicializar wiki
node .ai-factory/tools/openwiki/openwiki.js --init

# Atualizar documentação
node .ai-factory/tools/openwiki/openwiki.js --update

# One-shot
node .ai-factory/tools/openwiki/openwiki.js -p "Descreva a arquitetura"
```

**Output:** `.ai-factory/wiki/`

### 2. GNHF (`.ai-factory/tools/gnhf/`)

**Propósito:** Orquestrar agentes autônomos noturnos com validação V&V.

**Comandos:**
```bash
# Execução básica
node .ai-factory/tools/gnhf/gnhf.js "melhorar qualidade do código"

# Com opções
node .ai-factory/tools/gnhf/gnhf.js "adicionar testes" \
  --max-iterations 10 \
  --max-tokens 5000000 \
  --worktree

# Live branch
node .ai-factory/tools/gnhf/gnhf.js "refatorar API" \
  --current-branch \
  --push
```

**Handoffs:** `.ai-factory/handoffs/`

### 3. Validação V&V (`.ai-factory/scripts/run-vv.js`)

**Propósito:** Gate de 7 passos antes de commit no GNHF.

**Passos:**
1. ✅ Sintaxe e Type Checking
2. ✅ Testes Unitários
3. ✅ Testes de Integração
4. ✅ Security Scan
5. ✅ Performance Check
6. ✅ Code Style & Linting
7. ✅ Documentation Check

**Comando:**
```bash
node .ai-factory/scripts/run-vv.js --json
```

### 4. Memory Integration (`.ai-factory/scripts/memory-integration.js`)

**Propósito:** Conectar memória hierárquica com OpenWiki e GNHF.

**Comandos:**
```bash
# Sincronizar
node .ai-factory/scripts/memory-integration.js sync

# Injeta resumo
node .ai-factory/scripts/memory-integration.js inject

# Criar handoff
node .ai-factory/scripts/memory-integration.js handoff <conv-id>

# Buscar
node .ai-factory/scripts/memory-integration.js search <query>
```

## Fluxos de Trabalho

### Fluxo 1: Geração de Documentação (OpenWiki)

```
1. Trigger (schedule/manual)
   ↓
2. Scan do repositório
   ↓
3. Agrupar por seção (agents, skills, workflows, etc)
   ↓
4. Gerar docs em .ai-factory/wiki/
   ↓
5. Injetar resumo da memória
   ↓
6. Criar PR automático
```

### Fluxo 2: Execução Autônoma (GNHF)

```
1. Trigger (schedule/manual)
   ↓
2. Criar branch/worktree
   ↓
3. Loop de iterações:
   ├─ Carregar contexto (memória + handoffs)
   ├─ Executar agente
   ├─ Validação V&V (7 passos) ← Gate crítico
   ├─ Commit (se V&V aprovado)
   └─ Atualizar handoff
   ↓
4. Push e PR automático
   ↓
5. Upload de logs
```

### Fluxo 3: Integração Memória ↔ Wiki

```
1. Memory Watcher detecta mudanças
   ↓
2. Memory Summarizer gera resumo
   ↓
3. Memory Integration injeta na Wiki
   ↓
4. OpenWiki atualiza índices
   ↓
5. Agentes consultam Wiki atualizada
```

## GitHub Workflows

### 1. OpenWiki Update (`.github/workflows/openwiki-update.yml`)

- **Schedule:** Daily às 03:00 UTC
- **Trigger:** Manual via workflow_dispatch
- **Ações:**
  - Gera documentação
  - Cria PR automático
  - Notifica autor

### 2. GNHF Overnight (`.github/workflows/gnhf-overnight.yml`)

- **Schedule:** Daily às 02:00 UTC
- **Trigger:** Manual com prompt customizado
- **Ações:**
  - Executa GNHF
  - Valida com V&V
  - Push de mudanças
  - Cria PR automático
  - Upload de logs

## Estrutura de Arquivos

```
NexusAuto/
├── .ai-factory/
│   ├── tools/
│   │   ├── openwiki/
│   │   │   └── openwiki.js         # OpenWiki customizado
│   │   └── gnhf/
│   │       └── gnhf.js             # GNHF customizado
│   ├── scripts/
│   │   ├── run-vv.js               # Validação V&V
│   │   └── memory-integration.js   # Integração com memória
│   ├── wiki/                       # Docs auto-geradas
│   │   ├── architecture/
│   │   ├── agents/
│   │   ├── workflows/
│   │   ├── api/
│   │   ├── memory/
│   │   ├── skills/
│   │   └── handoffs/
│   └── handoffs/                   # Handoffs do GNHF
│       ├── iteration-1.md
│       ├── iteration-2.md
│       └── ...
├── .github/workflows/
│   ├── openwiki-update.yml         # Auto-update docs
│   └── gnhf-overnight.yml          # Overnight runs
├── .gnhf/
│   └── runs/                       # Runs do GNHF
│       └── <runId>/
│           ├── prompt.md
│           ├── notes.md
│           └── iteration-*.jsonl
└── nexusauto_memory.db             # Memória SQLite
```

## Configuração

### Variáveis de Ambiente

```bash
# GitHub Secrets (necessários)
ANTHROPIC_API_KEY=sk-...

# Opcional
OPENWIKI_OUTPUT_DIR=.ai-factory/wiki
GNHF_MAX_ITERATIONS=10
GNHF_MAX_TOKENS=5000000
```

### Configuração GNHF (`~/.gnhf/config.yml`)

```yaml
agent: claude
maxConsecutiveFailures: 3
preventSleep: true

commitMessage:
  preset: conventional
```

## Validação e Testes

### Testar OpenWiki

```bash
# Inicializar
node .ai-factory/tools/openwiki/openwiki.js --init

# Verificar output
ls -la .ai-factory/wiki/

# Atualizar
node .ai-factory/tools/openwiki/openwiki.js --update
```

### Testar GNHF

```bash
# Dry run (1 iteração)
node .ai-factory/tools/gnhf/gnhf.js "test" --max-iterations 1

# Verificar handoffs
ls -la .ai-factory/handoffs/

# Verificar V&V
node .ai-factory/scripts/run-vv.js --json
```

### Testar Integração

```bash
# Sincronizar memória
node .ai-factory/scripts/memory-integration.js sync

# Verificar wiki
cat .ai-factory/wiki/memory/RECENT_SUMMARY.md
```

## Monitoramento

### Logs

- **OpenWiki:** `.ai-factory/wiki/.update-log.json`
- **GNHF:** `.gnhf/runs/<runId>/gnhf.log`
- **V&V:** Console output + JSON

### Métricas

- **Documentação:**
  - Arquivos gerados
  - Tamanho total
  - Atualizações por dia

- **GNHF:**
  - Iterações por run
  - Taxa de sucesso V&V
  - Tokens consumidos
  - Falhas consecutivas

## Troubleshooting

### OpenWiki falha ao gerar docs

```bash
# Verificar permissões
ls -la .ai-factory/

# Rodar com verbose
node .ai-factory/tools/openwiki/openwiki.js --update --verbose
```

### GNHF falha na validação V&V

```bash
# Rodar V&V manualmente
node .ai-factory/scripts/run-vv.js

# Verificar logs
cat .gnhf/runs/*/gnhf.log
```

### Memória não sincroniza

```bash
# Verificar database
sqlite3 nexusauto_memory.db "SELECT COUNT(*) FROM memories;"

# Forçar sync
node .ai-factory/scripts/memory-integration.js sync
```

## Melhores Práticas

1. **Sempre rodar V&V antes de commit**
2. **Manter handoffs atualizados**
3. **Revisar PRs automáticos diariamente**
4. **Monitorar tokens do GNHF**
5. **Sincronizar memória regularmente**

## Próximos Passos

- [ ] Implementar modo interativo OpenWiki
- [ ] Adicionar suporte a mais agentes no GNHF
- [ ] Dashboard de monitoramento unificado
- [ ] Notificações via WhatsApp/Slack
- [ ] Relatórios de evolução de docs

---

*Documentação gerada automaticamente por NexusOpenWiki v1.0.0*