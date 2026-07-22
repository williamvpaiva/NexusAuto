# Melhoria #23: Token Economy

## Status
- **Prioridade**: 🔴 Máxima
- **Status**: 🚧 Em Implementação
- **Data Início**: 2026-07-03
- **Data Prevista**: 2026-07-10

## Objetivo
Reduzir custos operacionais com tokens em 70-80% através de arquitetura de contexto em camadas, handoffs resumidos e validação por cache.

## Problema
Em uma fábrica de software com 10+ agentes trocando arquivos Markdown e código, o custo com tokens é o maior vilão operacional:
- Handoffs completos: ~5.000 tokens cada
- Contexto carregado: ~20.000 tokens por tarefa
- Validações repetidas: ~10.000 tokens desperdiçados

## Soluções Implementadas

### 1. ✅ Contexto em Camadas (Layered Context)
**Arquivo**: `CONTEXT_SUMMARY.md`

- Layer 1: ~200 tokens (sempre carregado)
- Layer 2: ~2.000 tokens (sob demanda)
- Layer 3: Código específico (via RAG)

**Redução estimada**: -70% no contexto base

---

### 2. ✅ Handoffs Resumidos (Checkpointing)
**Arquivo**: `handoffs/HANDOFF_TEMPLATE.md`

- Template obrigatório de 200 tokens máximos
- Hash de git para cache
- Zero código duplicado

**Redução estimada**: -80% nos handoffs

---

### 3. ✅ RAG (Busca Semântica)
**Arquivo**: `scripts/retrieve-context.js`

- TF-IDF para busca de relevância
- Retorna apenas 3-5 arquivos mais relevantes
- Snippets de 50 linhas máximos

**Redução estimada**: -60% em código carregado

---

### 4. ✅ Validação por Cache
**Arquivo**: `VALIDATION_CACHE.md`

- Hash-based cache invalidation
- Pula validação se hash inalterado
- 3 níveis: Completo (7 passos), Parcial (3 passos), Cache (0 passos)

**Redução estimada**: -50% em validações

---

### 5. 🚧 Token Budget
**Arquivo**: `scripts/token-budget.js`

- Estima tokens antes de executar
- Divide tarefas > 50k tokens automaticamente
- Safety margin de 80%

**Impacto**: Evita estouros e otimiza alocação

---

### 6. 🚧 Templates Dinâmicos
**Arquivo**: `agents/_template.md` + `agents/configs/*.json`

- 1 template base + N configs JSON
- Montagem dinâmica de prompts
- Economia de ~70% em prompts repetidos

---

### 7. 🚧 Diff-based Updates
**Ferramenta**: `git diff --no-index` + `git apply`

- Agentes entregam patches, não arquivos completos
- Próximo agente aplica diff sobre cache local

**Redução estimada**: -60% em iterações

---

## Métricas de Sucesso

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| Tokens/tarefa | ~25.000 | ~5.000 | -80% |
| Tokens/handoff | ~5.000 | ~200 | -96% |
| Validações repetidas | 100% | 20% | -80% |
| Contexto carregado | ~20.000 | ~2.000 | -90% |
| Custo estimado/dia | R$ 500 | R$ 100 | -80% |

## Tarefas Pendentes

- [ ] Integrar `retrieve-context.js` no TECH-LEAD.md
- [ ] Implementar diff-based updates nos agentes
- [ ] Criar script `check-cache.js` para validação
- [ ] Adicionar métricas de tokens no PROGRESS.md
- [ ] Configurar cache expiration automático
- [ ] Testar com 21 agentes em paralelo

## Próximos Passos

1. **Semana 1**: Implementar integração no TECH-LEAD
2. **Semana 2**: Testar com todos os agentes
3. **Semana 3**: Ajustar thresholds com base em métricas
4. **Semana 4**: Documentar lições aprendidas

## Lições Aprendidas

*(A preencher durante implementação)*

---

*Documentação viva - Atualizar a cada sprint*