# 📊 Cross-Wave Delta Analysis

> **Comparar iterações do agente para identificar padrões recorrentes, regressões e melhorias**
> 
> Inspirado em recon-skills `cross-wave-delta-analysis`

---

## 📖 Propósito

Após cada **iteração de auditoria** (wave), comparar com a iteração anterior para responder:

1. **O que melhorou?** (regressões fixadas)
2. **O que piorou?** (novos problemas introduzidos)
3. **O que persiste?** (dívida técnica crônica)
4. **O que mudou?** (contexto diferente)

---

## 🔄 Quando Executar

| Gatilho | Frequência Sugerida |
|---------|--------------------|
| Após sprint review | Semanal |
| Após merge de feature grande | Por evento |
| Após auditoria completa | Por evento |
| Mensal (obrigatório) | Mensal |

---

## 📋 Template de Delta Report

```markdown
# Cross-Wave Delta: Wave N vs Wave N+1

**Data:** YYYY-MM-DD  
**Wave Anterior:** #N (YYYY-MM-DD)  
**Wave Atual:** #N+1 (YYYY-MM-DD)  
**Agentes Envolvidos:** <lista>

---

## Resumo Executivo

| Métrica | Wave N | Wave N+1 | Delta |
|---------|--------|----------|-------|
| Total Findings | X | Y | +/- Z |
| Critical Issues | X | Y | +/- Z |
| High Issues | X | Y | +/- Z |
| Tech Debt Score | X | Y | +/- Z |
| V&V Approval Rate | X% | Y% | +/- Z% |

---

## Delta por Categoria

### NEW (Problemas Novos)

| Finding | Arquivo | Severidade | Causa Raiz |
|---------|---------|------------|------------|
| <descrição> | <arquivo> | 🔴/🟡/🟢 | <causa> |

### REGRESSION (Problemas Fixos que Voltaram)

| Finding | Arquivo | Foi Fixado Em | Regrediu Em |
|---------|---------|---------------|-------------|
| <descrição> | <arquivo> | <commit> | <commit> |

### PERSISTENT (Problemas Crônicos)

| Finding | Arquivo | Waves Presente | Bloqueador |
|---------|---------|----------------|------------|
| <descrição> | <arquivo> | N, N+1, N+2... | Sim/Não |

### CHANGE (Mudanças de Contexto)

| Mudança | Impacto | Ação |
|---------|---------|------|
| <ex: nova dependência> | <ex: +2 vulnerabilities> | <ex: atualizar para v2.0> |

---

## Análise de Recorrência por Área

| Área (MELHORIAS/) | Wave N | Wave N+1 | Recorrência |
|-------------------|--------|----------|-------------|
| 01-ARQUITETURA | X issues | Y issues | 🔴 Alta / 🟡 Média / 🟢 Baixa |
| 08-SEGURANCA | X issues | Y issues | 🔴 Alta / 🟡 Média / 🟢 Baixa |
| 09-TESTES | X issues | Y issues | 🔴 Alta / 🟡 Média / 🟢 Baixa |
| ... | ... | ... | ... |

---

## Priority Adjustment

| Finding | Prioridade Anterior | Nova Prioridade | Justificativa |
|---------|--------------------|-----------------|---------------|
| <finding> | 🟡 Alta | 🔴 Crítica | Persiste há 3 waves |
| <finding> | 🔴 Crítica | 🟢 Baixa | Fixado na wave N+1 |

---

## Ações Recomendadas

1. **Imediato (próxima sprint):**
   - [ ] <ação 1>
   - [ ] <ação 2>

2. **Curto Prazo (próximo mês):**
   - [ ] <ação 1>
   - [ ] <ação 2>

3. **Longo Prazo (próximo trimestre):**
   - [ ] <ação 1>
   - [ ] <ação 2>

---

## Lições Aprendidas

- **O que funcionou:** <descrição>
- **O que não funcionou:** <descrição>
- **O que mudar na próxima wave:** <descrição>
```

---

## 🔧 Como Executar (Passo a Passo)

### **Passo 1: Coletar Dados da Wave Anterior**

```bash
# 1. Listar findings da wave anterior
node scripts/memory-manager.js search "wave N findings" --type report --topK 10

# 2. Ler RELATÓRIO V&V da wave anterior
cat .ai-factory/MELHORIAS/LOG-VALIDACOES.md | grep "Wave N"

# 3. Extrair métricas do INDEX.md
cat .ai-factory/MELHORIAS/INDEX.md | grep "Progresso"
```

### **Passo 2: Coletar Dados da Wave Atual**

```bash
# 1. Listar findings da wave atual
node scripts/memory-manager.js search "wave N+1 findings" --type report --topK 10

# 2. Ler RELATÓRIO V&V da wave atual
cat .ai-factory/MELHORIAS/LOG-VALIDACOES.md | grep "Wave N+1"
```

### **Passo 3: Preencher Template**

1. Copiar template acima para `.ai-factory/MELHORIAS/CROSS-WAVE-DELTA.md`
2. Preencher com dados coletados
3. Calcular deltas (matemática simples)
4. Classificar recorrência por área

### **Passo 4: Gerar Ações**

Para cada **PERSISTENT** > 2 waves:
- Criar tarefa em `.ai-factory/MELHORIAS/<AREA>/TAREFAS.md`
- Marcar como 🔴 Crítica se persiste > 3 waves

Para cada **REGRESSION**:
- Investigar causa raiz (por que o fix não funcionou?)
- Criar teste para prevenir nova regressão

### **Passo 5: Salvar e Notificar**

```bash
# 1. Salvar delta report
node scripts/memory-manager.js save "Cross-Wave Delta N vs N+1" --type report --tags delta,recorrência

# 2. Notificar TECH-LEAD
echo "Cross-Wave Delta completo: .ai-factory/MELHORIAS/CROSS-WAVE-DELTA.md"
```

---

## 📊 Métricas para Acompanhar

| Métrica | Como Calcular | Meta |
|---------|---------------|------|
| **Findings por Wave** | Count de findings em cada wave | 📉 Diminuir |
| **Taxa de Regressão** | (Regressões / Total Findings) × 100 | < 10% |
| **Taxa de Persistência** | (Persistentes / Total Findings) × 100 | < 20% |
| **V&V Approval Rate** | (Aprovados / Total V&V) × 100 | > 90% |
| **Tech Debt Score** | Soma dos scores de todas as issues | 📉 Diminuir |

---

## 🔗 Cross-References

- `TECH-LEAD.md` → Orquestra execução do delta analysis
- `meta/cross-iteration-analysis.md` → Meta skill complementar
- `MELHORIAS/INDEX.md` → Dashboard com progresso geral
- `MELHORIAS/LOG-VALIDACOES.md` → Histórico de V&V

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/meta/cross-wave-delta.md`