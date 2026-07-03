# Regras de Transição Consolidadas

## Matriz de Handoffs

| De | Para | Gatilho | Artefatos |
|---|---|---|---|
| Stakeholder | Analyst | Demanda recebida | brief, objetivos |
| Analyst | Architect | Requisitos aprovados | requirements.md, user-stories.md |
| Architect | Devs | Design completo | architecture-design.md, ADRs |
| Devs | Security | Código completo + testes | código, openapi.yaml |
| Devs | Performance | Código completo + testes | código, queries |
| Security + Performance | QA | Auditorias aprovadas | reports |
| QA | DevOps | GO emitido | qa-report.md |
| DevOps | Todos | Release ok ou rollback | deploy通知 |

---

## Protocolo Universal de Handoff

Todo handoff **DEVE** conter estas 5 seções:

### 1. O que foi feito
Resumo objetivo em 3-5 bullets

### 2. Artefatos entregues
```
- caminho/arquivo: descrição do que é
```

### 3. Decisões tomadas
```
- Decisão: {o que}
  Motivo: {por que}
  Ref: {ADR-ID se houver}
```

### 4. Pontos de atenção
- Riscos identificados
- Limitações conhecidas
- Known issues

### 5. O que se espera de você
Tarefas específicas do próximo agente

---

## Template de Handoff

```markdown
# Handoff: {agente_origem} → {agente_destino}

## Data
{YYYY-MM-DD}

## Resumo
- Item 1 concluído
- Item 2 concluído
- Item 3 concluído

## Artefatos Entregues
| Arquivo | Descrição |
|---------|-----------|
| docs/analysis/requirements.md | Requisitos funcionais e NFRs |
| docs/analysis/user-stories.md | 15 user stories priorizadas |
| docs/analysis/acceptance-criteria.md | Critérios de aceite em BDD |

## Decisões Tomadas
- Decisão: Usar PostgreSQL em vez de MongoDB
  Motivo: Dados relacionais + ACID necessário
  Ref: ADR-001

- Decisão: Autenticação com JWT
  Motivo: Stateless, fácil de escalar
  Ref: ADR-002

## Pontos de Atenção
⚠️ **Risco:** Integração com sistema legado pode demorar
⚠️ **Limitação:** Rate limit não implementado nesta fase
📝 **Known Issue:** IE11 não suportado

## Próximos Passos (para {agente_destino})
1. {tarefa 1}
2. {tarefa 2}
3. {tarefa 3}

## Checklist de Saída (origem)
- [ ] Checklist do agente completado
- [ ] Todos os artefatos criados
- [ ] Code review aprovado (se aplicável)
- [ ] Testes passando (se aplicável)

---
**Status:** ✅ Pronto para handoff / ❌ Pendências
```

---

## Regras de Devolução

### 1. Devolução SEMPRE com artefato
- Security → Devs: `remediation-plan.md`
- Performance → Devs: `optimization-plan.md`
- QA → Devs: `bug-reports/`

### 2. Devolução NÃO é falha
É o processo funcionando corretamente.

### 3. Máximo 2 ciclos de devolução
Na mesma etapa. Depois escalar para architect ou PO.

### 4. Registrar devoluções
No `PROGRESS.md` (métricas de processo)

---

## Resolução de Conflitos

| Conflito | Quem Decide |
|----------|-------------|
| Requisito ambíguo | Analyst (consultando stakeholder) |
| Decisão técnica | Architect |
| Contrato de API | Architect (com input de front e back) |
| Prioridade de bugs | QA + PO |
| Go/No-go de release | QA (qualidade) + DevOps (operação) |
| Trade-off segurança vs prazo | Security (veto em críticos e altos) |

---

## Definition of Ready (DoR)

Uma tarefa só começa se:

- [ ] Problema claro
- [ ] Critérios de aceite definidos
- [ ] Dependências conhecidas
- [ ] Prioridade definida
- [ ] Estimativa de esforço feita

---

## Definition of Done (DoD)

Uma tarefa só termina se:

- [ ] Implementação concluída
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Code review aprovado
- [ ] Pronto para handoff

---

## Métricas de Handoff

### Para medir eficiência do processo

| Métrica | Fórmula | Target |
|---------|---------|--------|
| Ciclos de devolução | total devoluções / total handoffs | < 0.3 |
| Tempo médio por etapa | soma dias / número etapas | - |
| Taxa de aprovação na primeira | handoffs sem devolução / total | > 70% |
| Bugs em produção pós-release | bugs críticos / release | 0 |

---

## Exemplo Prático

### Handoff: Analyst → Architect

```markdown
# Handoff: analyst → architect

## Data
2024-01-15

## Resumo
- 25 requisitos funcionais levantados
- 12 requisitos não-funcionais definidos
- 15 user stories priorizadas (MoSCoW)
- 45 critérios de aceite em BDD
- 8 regras de negócio documentadas

## Artefatos Entregues
| Arquivo | Descrição |
|---------|-----------|
| docs/analysis/requirements.md | 25 RFs + 12 RNFs |
| docs/analysis/user-stories.md | 15 US (8 Must, 4 Should, 3 Could) |
| docs/analysis/acceptance-criteria.md | 45 critérios BDD |
| docs/analysis/business-rules.md | 8 regras de negócio |
| docs/analysis/glossary.md | 23 termos do domínio |

## Decisões Tomadas
- Decisão: Priorizar mobile-first
  Motivo: 80% dos usuários acessam via mobile
  
- Decisão: LGPD compliance obrigatório
  Motivo: Dados de usuários brasileiros

## Pontos de Atenção
⚠️ **Risco:** Stakeholder principal viaja em 2 semanas
⚠️ **Limitação:** API de pagamento tem sandbox limitado
📝 **Known Issue:** Definição de roles de usuário ainda pendente

## Próximos Passos (para architect)
1. Definir arquitetura técnica
2. Escolher stack tecnológico
3. Especificar APIs (contratos front-back)
4. Modelar banco de dados
5. Criar ADRs para decisões principais

## Checklist de Saída
- [x] Checklist do analyst completado
- [x] Todos os artefatos criados
- [x] Stakeholder validou requisitos

---
**Status:** ✅ Pronto para handoff
```