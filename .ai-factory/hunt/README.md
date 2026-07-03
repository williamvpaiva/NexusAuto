# 🎯 Hunt Skills — Detecção por Classe de Problema

> **Skills hiper-específicas para detectar padrões de problemas no codebase**
> 
> Acionadas pelo TECH-LEAD quando identifica necessidade de auditoria específica

---

## 📖 Como Funciona

Cada `hunt-*.md` é uma skill especializada em **um único padrão de problema**:

```markdown
## When to Use      → Gatilhos exatos de ativação
## Prerequisites    → O que precisa estar pronto
## How to Run       → Comandos/passos copy-paste
## Procedure        → Passo a passo numerado
## Pitfalls         → Falsos positivos e armadilhas
## Verification     → Como confirmar detecção e fix
```

---

## 📦 Hunt Skills Disponíveis

| Skill | Problema Detectado | Prioridade |
|-------|-------------------|------------|
| `hunt-n-plus-one-queries` | N+1 queries em loops | 🔴 Alta |
| `hunt-missing-input-validation` | Inputs sem validação | 🔴 Alta |
| `hunt-hardcoded-secrets` | Secrets hardcoded | 🔴 Crítica |
| `hunt-dead-code` | Código morto/inalcançável | 🟡 Média |
| `hunt-missing-error-handling` | Promises/calls sem try-catch | 🔴 Alta |

---

## 🔄 Fluxo de Execução

```
1. TECH-LEAD detecta necessidade (ex: "auditar N+1")
2. Carrega hunt skill específica
3. Skill executa detecção sistemática
4. Reporta findings para TECH-LEAD
5. TECH-LEAD atribui fix para agente apropriado
6. QA valida fix com mesma hunt skill
```

---

## 📊 Scoring de Prioridade

| Score | Critério | Ação |
|-------|----------|------|
| 8-10 | Auth/Pagamento + Production | TECH-LEAD escala para Nível 1 V&V |
| 5-7 | Múltiplos arquivos | Atribui para senior dev |
| 1-4 | Isolado, baixo impacto | Atribui para dev regular |

---

## 🎯 Quando TECH-LEAD Aciona

| Gatilho | Hunt Skill Acionada |
|---------|--------------------|
| "lentidão no banco" | `hunt-n-plus-one-queries` |
| "segurança dos inputs" | `hunt-missing-input-validation` |
| "vazamento de secrets" | `hunt-hardcoded-secrets` |
| "código inútil" | `hunt-dead-code` |
| "erros silenciosos" | `hunt-missing-error-handling` |

---

## 📝 Como Criar Nova Hunt Skill

1. Criar arquivo: `hunt/<skill-name>.md`
2. Seguir template obrigatório (ver abaixo)
3. Adicionar cross-reference no `INDEX.md`
4. Notificar TECH-LEAD para registrar

---

## 📋 Template Obrigatório

```markdown
# 🎯 Hunt <Nome do Problema>

> **Uma frase:** Detecta <problema> em <contexto>

---

## When to Use

- [ ] Gatilho 1
- [ ] Gatilho 2
- [ ] Gatilho 3

---

## Prerequisites

- [ ] Pré-requisito 1
- [ ] Pré-requisito 2

---

## How to Run

```bash
# Comando ou passo inicial
```

---

## Procedure

1. **Passo 1:** Descrição + comando exato
2. **Passo 2:** Descrição + comando exato
3. **Passo 3:** Descrição + comando exato

---

## Pitfalls

- ⚠️ Falso positivo comum: <descrição>
- ⚠️ Edge case: <descrição>

---

## Verification

### Para Detecção
- [ ] Critério 1 de sucesso
- [ ] Critério 2 de sucesso

### Para Fix
- [ ] Critério 1 de fix confirmado
- [ ] Critério 2 de fix confirmado

---

## Score Calculation

| Fator | Score |
|-------|-------|
| Auth/Pagamento envolvido | +5 |
| Production code | +3 |
| Múltiplos arquivos | +2 |
| Recorrência > 5 vezes | +2 |

**Total:** <score> → <ação recomendada>

---

## Related Skills

- `chains/<chain-name>` (se aplicável)
- `agents/<agent-name>` (quem faz o fix)
```

---

**Versão:** 1.0.0  
**Manutenção:** TECH-LEAD + Security Agent  
**Local:** `.ai-factory/hunt/README.md`