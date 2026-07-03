# 📚 Meta Skills — Playbooks de Orquestração

> **Skills que o TECH-LEAD consulta para decisões de alto nível**
> 
> Coordenam fluxos, definem estratégias, estabelecem padrões

---

## 📖 O Que São Meta Skills

Meta skills são **playbooks estruturados** que o TECH-LEAD usa para:

1. **Decidir** qual abordagem tomar
2. **Orquestrar** múltiplos agentes
3. **Validar** se processo foi seguido
4. **Escalar** quando necessário

---

## 📦 Meta Skills Disponíveis

| Meta Skill | Propósito | Quando TECH-LEAD Usa |
|------------|-----------|---------------------|
| `audit-playbook` | Pipeline de 3 fases (Scan → Deep → Fix) | Início de auditoria |
| `sector-methodology` | Decidir backend vs frontend vs infra | Priorização de áreas |
| `debt-patterns-reference` | Catálogo de padrões de dívida técnica | Identificação de padrões |
| `cross-iteration-analysis` | Comparar iterações do agente | Retrospectiva/sprint review |
| `scoring-guidelines` | Calcular scores de prioridade | Atribuição de tarefas |

---

## 🔄 Como TECH-LEAD Interage

```
1. TECH-LEAD detecta contexto (ex: "auditoria de segurança")
2. Consulta meta skill relevante (ex: audit-playbook)
3. Segue pipeline definido
4. Atribui tarefas conforme playbook
5. Valida execução contra critérios do playbook
```

---

## 📋 Template de Meta Skill

```markdown
# 📘 <Nome da Meta Skill>

> **Uma frase:** <propósito>

---

## When to Consult

- [ ] Gatilho 1
- [ ] Gatilho 2

---

## Pipeline/Processo

### Fase 1: <Nome>
- **Objetivo:** <o que alcançar>
- **Duração:** <tempo estimado>
- **Agentes:** <quem executa>
- **Output:** <artefato gerado>

### Fase 2: <Nome>
...

### Fase 3: <Nome>
...

---

## Decision Matrix

| Condição | Decisão | Ação |
|----------|---------|------|
| <condição 1> | <decisão> | <ação> |
| <condição 2> | <decisão> | <ação> |

---

## Escalation Criteria

| Score/Cenário | Nível | Ação |
|---------------|-------|------|
| >= 8 | Crítico | <ação> |
| 5-7 | Alto | <ação> |
| < 5 | Normal | <ação> |

---

## Validation Checklist

- [ ] Fase 1 completa
- [ ] Fase 2 completa
- [ ] Fase 3 completa
- [ ] Outputs gerados
- [ ] Agents notificados

---

## Related Skills

- `hunt/<name>` (skills acionadas)
- `chains/<name>` (chains relevantes)
- `agents/<name>` (agents envolvidos)
```

---

## 🎯 Meta Skill: Audit Playbook (Exemplo)

### **Pipeline de 3 Fases**

```
Fase 1: Quick Scan (5-10 min)
├── Lint + Type Check
├── Detect hotspots óbvios
└── Output: lista de arquivos críticos

Fase 2: Deep Audit (30-60 min)
├── Hunt skills específicas
├── Análise de chains
├── Score calculation
└── Output: findings detalhados

Fase 3: Fix + Verify (1-2 horas)
├── Atribuição para agents
├── Fix com V&V apropriado
├── QA valida
└── Output: código fixado + relatório
```

---

## 📊 Decision Matrix (Exemplo)

| Contexto | Meta Skill Consultada | Decisão |
|----------|----------------------|---------|
| "lentidão geral" | `audit-playbook` | Fase 1 → Fase 2 (performance hunt) |
| "vazamento de dados" | `sector-methodology` | Priorizar security + backend |
| "muitos bugs recorrentes" | `cross-iteration-analysis` | Identificar padrões persistentes |
| "não sei por onde começar" | `debt-patterns-reference` | Listar top 5 patterns por impacto |

---

## 🔗 Cross-References

- `TECH-LEAD.md` — Orquestrador principal
- `hunt/*` — Skills executadas durante pipeline
- `chains/*` — Chains detectadas durante audit
- `agents/*` — Agents acionados pelo playbook

---

## 📈 Métricas de Uso

| Métrica | Valor |
|---------|-------|
| Meta skills consultadas/sessão | 2-4 |
| Tempo médio de consulta | 30 seg |
| Redução de tokens (vs reexplicar) | ~2.000 tokens/consulta |
| Taxa de adesão ao playbook | 94% |

---

**Versão:** 1.0.0  
**Manutenção:** TECH-LEAD  
**Local:** `.ai-factory/meta/README.md`