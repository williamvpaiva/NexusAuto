# Workflow: Resposta a Emergência

## Trigger
Incidente crítico em produção (sistema indisponível, dados expostos, perda de receita)

---

## Stage 1 — Triage Imediato
**Agente:** tech-lead

**Tarefas:**
1. Classificar severidade (INC-1: indisponibilidade, INC-2: dados, INC-3: segurança)
2. Pingar squad no canal de incidentes
3. Abrir janela de incidente no PROGRESS.md

**Gate:**
- [ ] Severidade e impacto confirmados
- [ ] Squad notificado

---

## Stage 2 — Containment
**Agente:** backend-dev ou devops (conforme causa)

**Tarefas:**
1. Isolar causa (reverter deploy, feature flag off, bloquear IP, etc.)
2. Restaurar serviço para usuários (rollback ou bypass)
3. Documentar ação de containment em `INCIDENT-{ID}.md`

**Gate:**
- [ ] Serviço restaurando para usuários
- [ ] Causa imediata identificada

---

## Stage 3 — Diagnóstico (Pós-containment)
**Agente:** backend-dev ou frontend-dev

**Tarefas:**
1. Investigar causa raiz (logs, métricas, traces, queries lentas)
2. Identificar todos os sistemas afetados (cascata)
3. Verificar se há dados corrompidos

**Gate:**
- [ ] Causa raiz documentada

---

## Stage 4 — Fix
**Agente:** backend-dev ou frontend-dev

**Tarefas:**
1. Implementar correção definitiva
2. Escrever teste que captura a falha
3. Review por 2 pares (mínimo)

**Gate:**
- [ ] Teste passando
- [ ] Review aprovado

---

## Stage 5 — Pós-incidente
**Agente:** tech-lead

**Tarefas:**
1. Post-mortem (blameless) em 24h
2. Atualizar bugfix.md se aplicável
3. Adicionar monitoramento para detectar recorrência

**Gate:**
- [ ] Post-mortem publicado
- [ ] Monitoramento adicionado

---

## Timeline Esperada
| Fase | SLA |
|------|-----|
| Triage | 5 min |
| Containment | 30 min |
| Diagnóstico | 2 h |
| Fix | 4 h |
| Post-mortem | 24 h |

---

## Regras Gerais
- **Comunicação pública**: Atualizar status a cada 30 min no canal
- **Sem blame**: Post-mortem busca causas, não culpados
- **Mudanças mínimas**: Fix só o necessário para resolver, melhorias ficam para tarefas separadas
