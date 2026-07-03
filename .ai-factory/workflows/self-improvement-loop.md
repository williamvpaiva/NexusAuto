# 🔄 Self-Improvement Loop

> **Sistema de evolução contínua das skills baseado em findings reais**
> 
> Inspirado em recon-skills `self-improvement-loop`

---

## 📖 Conceito

O sistema **aprende com cada execução**:

```
Agents audit codebase → Findings em output/
                                    ↓
Skill Architect lê findings → Cria/melhora skills
                                    ↓
Cross-wave synthesis → Intelligence report
                                    ↓
                              Próxima iteração usa skills melhoradas
                                    ↓
                              INFINITO
```

---

## 🎯 Papéis

| Papel | Responsabilidade | Quem Executa |
|-------|-----------------|--------------|
| **Executor** | Roda auditorias com skills atuais | Qualquer agente |
| **Skill Architect** | Lê findings, identifica gaps, atualiza skills | TECH-LEAD + architect |
| **Synthesizer** | Consolida learnings cross-wave | TECH-LEAD |
| **Validator** | Valida que skills melhoradas funcionam | qa-tester |

---

## 🔄 Fluxo Completo

### **Fase 1: Execução**

```
1. Agente executa auditoria usando skill atual
2. Salva findings em `.ai-factory/output/`
3. Preenche RELATÓRIO V&V
4. Notifica TECH-LEAD
```

### **Fase 2: Análise de Gaps**

```
1. Skill Architect lê findings
2. Identifica:
   - Falsos negativos (skill não detectou)
   - Falsos positivos (skill detectou errado)
   - Gaps de cobertura (área não coberta)
   - Oportunidades de automação
3. Documenta gaps em `.ai-factory/MELHORIAS/00-SKILLS-GAPS.md`
```

### **Fase 3: Evolução de Skills**

```
1. Criar nova skill OU melhorar existente
2. Seguir template padrão (`.ai-factory/hunt/README.md`)
3. Adicionar cross-references
4. Commitar com mensagem: "feat(skill): <descrição>"
```

### **Fase 4: Validação**

```
1. QA-tester roda skill melhorada em código conhecido
2. Verifica se detecta findings esperados
3. Verifica se não gera falsos positivos
4. Atualiza VALIDATION_CACHE.md
```

### **Fase 5: Síntese Cross-Wave**

```
1. A cada 3+ waves, Synthesizer consolida:
   - Padrões recorrentes
   - Skills mais eficazes
   - Skills que precisam de aposentadoria
2. Gera `.ai-factory/MELHORIAS/SKILLS-INTELLIGENCE-REPORT.md`
3. Ajusta prioridades de evolução
```

---

## 📊 Gatilhos de Evolução

| Gatilho | Ação | Prioridade |
|---------|------|------------|
| Falso negativo detectado | Adicionar padrão à skill | 🔴 Alta |
| Falso positivo detectado | Refinar critérios de detecção | 🔴 Alta |
| Nova classe de problema | Criar nova hunt skill | 🟡 Alta |
| Skill não usada há 3 waves | Avaliar aposentadoria | 🟢 Baixa |
| Skill com > 500 linhas | Dividir em sub-skills | 🟡 Média |

---

## 📋 Template: Skill Gap Analysis

```markdown
# Skill Gap Analysis

**Data:** YYYY-MM-DD  
**Wave:** #N  
**Skill Analisada:** `hunt-<name>`

---

## Gaps Identificados

### Falso Negativo

**O que aconteceu:** <descrição>  
**Por que a skill não detectou:** <razão>  
**Como corrigir:** <ação>

### Falso Positivo

**O que aconteceu:** <descrição>  
**Por que a skill detectou errado:** <razão>  
**Como corrigir:** <ação>

### Gap de Cobertura

**Área não coberta:** <descrição>  
**Impacto:** <severidade>  
**Como cobrir:** <ação>

---

## Ações de Evolução

- [ ] Atualizar `hunt-<name>.md` com novos padrões
- [ ] Adicionar exemplo real em `## Real Production Results`
- [ ] Criar teste para validar detecção
- [ ] Atualizar cross-references

---

## Validação

- [ ] Skill melhorada detecta falso negativo anterior
- [ ] Skill melhorada não gera falso positivo anterior
- [ ] QA validou em `.ai-factory/MELHORIAS/LOG-VALIDACOES.md`
```

---

## 📈 Métricas de Evolução

| Métrica | Como Calcular | Meta |
|---------|---------------|------|
| **Skills Criadas/Wave** | Count de novas skills por wave | 1-2 |
| **Skills Melhoradas/Wave** | Count de skills atualizadas por wave | 2-4 |
| **Falso Negativo Rate** | (FN / Total Findings) × 100 | < 5% |
| **Falso Positivo Rate** | (FP / Total Findings) × 100 | < 10% |
| **Skill Coverage** | (Áreas cobertas / Áreas totais) × 100 | > 80% |

---

## 🔗 Cross-References

- `TECH-LEAD.md` → Orquestra loop de melhoria
- `hunt/README.md` → Catálogo de hunt skills
- `chains/README.md` → Catálogo de chains
- `meta/cross-wave-delta.md` → Análise de iterações
- `MELHORIAS/INDEX.md` → Dashboard com progresso

---

## 🚀 Primeiros Passos

1. **Executar wave de auditoria** com skills atuais
2. **Ler findings** em `.ai-factory/output/`
3. **Identificar 1 gap** (falso negativo/positivo ou cobertura)
4. **Atualizar 1 skill** com aprendizado
5. **Validar** com qa-tester
6. **Repetir** na próxima wave

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/workflows/self-improvement-loop.md`