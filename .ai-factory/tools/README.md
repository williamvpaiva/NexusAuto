# NexusAuto Tools - OpenWiki + GNHF Integration

## 📦 Instalação

Nenhuma instalação necessária - ferramentas já estão em `.ai-factory/tools/`

## 🚀 Quick Start

### 1. Inicializar Wiki
```bash
node .ai-factory/tools/openwiki/openwiki.js --init
```

### 2. Executar GNHF
```bash
node .ai-factory/tools/gnhf/gnhf.js "Melhorar qualidade do código" --max-iterations 5
```

### 3. Rodar Integração Completa
```bash
node .ai-factory/scripts/integrate.js full
```

### 4. Executar Testes
```bash
node .ai-factory/scripts/test-integration.js
```

## 📁 Estrutura

```
.ai-factory/
├── tools/
│   ├── openwiki/
│   │   └── openwiki.js         # Geração de docs
│   └── gnhf/
│       └── gnhf.js             # Agentes autônomos
├── scripts/
│   ├── run-vv.js               # Validação V&V (7 passos)
│   ├── memory-integration.js   # Sync memória ↔ wiki
│   ├── integrate.js            # Orquestração completa
│   └── test-integration.js     # Test suite
├── wiki/                       # Docs auto-geradas
│   ├── architecture/
│   ├── agents/
│   ├── workflows/
│   ├── api/
│   ├── memory/
│   ├── skills/
│   └── handoffs/
└── handoffs/                   # Handoffs do GNHF
    └── iteration-*.md
```

## 🛠️ Comandos

### OpenWiki

| Comando | Descrição |
|---------|-----------|
| `--init` | Inicializa wiki |
| `--update` | Atualiza docs |
| `-p "prompt"` | One-shot query |
| `--verbose` | Logs detalhados |

### GNHF

| Flag | Descrição | Default |
|------|-----------|---------|
| `--max-iterations <n>` | Abortar após n iterações | ∞ |
| `--max-tokens <n>` | Abortar após n tokens | ∞ |
| `--stop-when <cond>` | Parar quando condição | ∞ |
| `--agent <agent>` | Agente (claude, codex, etc) | claude |
| `--current-branch` | Usar branch atual | false |
| `--push` | Push após commit | false |
| `--worktree` | Rodar em worktree | false |

### V&V

```bash
# Executar validação
node .ai-factory/scripts/run-vv.js

# Output JSON
node .ai-factory/scripts/run-vv.js --json
```

**Passos:**
1. ✅ Sintaxe e Type Checking
2. ✅ Testes Unitários
3. ✅ Testes de Integração
4. ✅ Security Scan
5. ✅ Performance Check
6. ✅ Code Style & Linting
7. ✅ Documentation Check

### Memory Integration

| Comando | Descrição |
|---------|-----------|
| `sync` | Sincroniza Wiki com memória |
| `inject` | Injeta resumo na Wiki |
| `update` | Atualiza com mudanças recentes |
| `handoff <id>` | Cria handoff de conversação |
| `search <query>` | Busca na memória |

### Integration

| Modo | Descrição |
|------|-----------|
| `full` | Tudo (OpenWiki + GNHF + Sync + V&V) |
| `wiki` | Apenas OpenWiki |
| `gnhf` | Apenas GNHF |
| `sync` | Apenas memória |
| `vv` | Apenas V&V |

## 🔄 GitHub Workflows

### OpenWiki Update
- **Schedule:** Daily 03:00 UTC
- **File:** `.github/workflows/openwiki-update.yml`
- **Ação:** Cria PR automático com docs atualizadas

### GNHF Overnight
- **Schedule:** Daily 02:00 UTC
- **File:** `.github/workflows/gnhf-overnight.yml`
- **Ação:** Executa GNHF, valida V&V, cria PR

## 📊 Tech Lead Commands

Novos comandos adicionados ao TECH-LEAD.md:

```bash
/wiki init                    # Inicializar wiki
/wiki update                  # Atualizar docs
/gnhf run "objetivo"          # Executar GNHF
/gnhf status                  # Status runs
/vv run                       # Validar V&V
/memory sync                  # Sync memória
/integrate full               # Integração completa
```

## 🧪 Testes

```bash
# Todos os testes
node .ai-factory/scripts/test-integration.js

# Teste específico
node .ai-factory/scripts/test-integration.js openwiki init
node .ai-factory/scripts/test-integration.js gnhf run
node .ai-factory/scripts/test-integration.js vv all-steps
node .ai-factory/scripts/test-integration.js memory sync
node .ai-factory/scripts/test-integration.js integration full-flow
```

## 📈 Métricas

### OpenWiki
- Arquivos gerados: ~50+
- Seções: 7 (architecture, agents, workflows, api, memory, skills, handoffs)
- Atualização: Diária automática

### GNHF
- Iterações típicas: 3-10
- Tokens por run: ~50k-500k
- Taxa de sucesso V&V: ~80%

### V&V
- Passos: 7
- Tempo médio: 30-60s
- Gate crítico: Sim (pré-commit)

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# GitHub Secrets
ANTHROPIC_API_KEY=sk-...

# Opcional
OPENWIKI_OUTPUT_DIR=.ai-factory/wiki
GNHF_MAX_ITERATIONS=10
GNHF_MAX_TOKENS=5000000
```

### Config GNHF (`~/.gnhf/config.yml`)

```yaml
agent: claude
maxConsecutiveFailures: 3
preventSleep: true

commitMessage:
  preset: conventional
```

## 📚 Documentação

- **Integration Guide:** `.ai-factory/tools/INTEGRACAO.md`
- **Tech Lead:** `.ai-factory/TECH-LEAD.md`
- **AI Factory:** `AI-FACTORY.md`
- **Context:** `CONTEXT_SUMMARY.md`

## 🐛 Troubleshooting

### OpenWiki falha
```bash
# Verbose
node .ai-factory/tools/openwiki/openwiki.js --update --verbose

# Limpar e recriar
rm -rf .ai-factory/wiki
node .ai-factory/tools/openwiki/openwiki.js --init
```

### GNHF falha no V&V
```bash
# Rodar V&V manualmente
node .ai-factory/scripts/run-vv.js

# Verificar logs
cat .gnhf/runs/*/gnhf.log
```

### Memória não sync
```bash
# Forçar sync
node .ai-factory/scripts/memory-integration.js sync

# Verificar DB
sqlite3 nexusauto_memory.db "SELECT COUNT(*) FROM memories;"
```

## ✅ Checklist de Implementação

- [x] OpenWiki customizado criado
- [x] GNHF customizado criado
- [x] V&V script criado
- [x] Memory integration criada
- [x] Integration script criado
- [x] Test suite criada
- [x] GitHub workflows criados
- [x] TECH-LEAD.md atualizado
- [x] AI-FACTORY.md atualizado
- [x] CONTEXT_SUMMARY.md atualizado
- [x] INTEGRACAO.md criado
- [x] README criado

## 🎯 Próximos Passos

- [ ] Dashboard de monitoramento unificado
- [ ] Notificações via WhatsApp
- [ ] Relatórios de evolução de docs
- [ ] Mais agentes no GNHF
- [ ] Modo interativo OpenWiki

---

*Implementado em 2026-07-07 | NexusAuto AI Factory*