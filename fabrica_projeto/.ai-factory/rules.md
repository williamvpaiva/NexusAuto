# AI Factory Rules for POLYMARKETING

> Regras obrigatórias para todos os agentes de IA trabalhando neste projeto

---

## 🤖 Agente Ativo

**Sempre** leia primeiro:
```
.ai-factory/agents/tech-lead.md
```

O Tech Lead é o **orquestrador principal** deste projeto.

---

## 🛡️ Regras Invioláveis

### 1. V&V Obrigatório
```
NUNCA marque tarefa como 🟢 sem V&V ✅ APROVADO
SEMPRE execute os 7 passos após CADA alteração
REGISTRE em .ai-factory/MELHORIAS/LOG-VALIDACOES.md
```

### 2. Orquestração
```
SEMPRE consulte o Tech Lead antes de agir
NUNCA trabalhe isolado em melhorias
SIGA a matriz de roteamento
```

### 3. Priorização
```
🔴 Crítico primeiro (Segurança, Bugs, CI/CD)
🟠 Alto em seguida (Performance, Testes)
🟡 Médio depois (Code smells, Docs)
🟢 Contínuo por último (Refatoração, DX)
```

### 4. Comunicação
```
Seja curto e direto
Não explique o óbvio
Foque em ação e resultado
```

---

## 📋 Fluxo de Trabalho

### Para Nova Tarefa
1. Leia `.ai-factory/agents/tech-lead.md`
2. Execute `scan tarefas pendentes`
3. Identifique agente responsável
4. Atribua com @mention
5. Execute com V&V
6. Registre no log

### Para Feature Nova
1. Leia `.ai-factory/workflows/new-feature.md`
2. Siga o fluxo: analyst → architect → devs → qa → devops
3. Execute V&V em cada etapa
4. Handoff com checklist completo

### Para Bug Fix
1. Leia `.ai-factory/workflows/bugfix.md`
2. Siga o fluxo: triage → diagnóstico → fix → validação
3. Execute V&V após o fix
4. Adicione teste de regressão

---

## 📁 Arquivos Chave

| Arquivo | Quando Ler |
|---------|------------|
| `.ai-factory/agents/tech-lead.md` | Sempre (orquestrador) |
| `.ai-factory/FACTORY.CONFIG.md` | Início de sessão |
| `.ai-factory/PROJECT_CONTEXT.md` | Primeira vez no projeto |
| `.ai-factory/standards/vv-protocol.md` | Após cada alteração |
| `.ai-factory/MELHORIAS/INDEX.md` | Ver progresso |
| `.ai-factory/MELHORIAS/LOG-VALIDACOES.md` | Registrar V&V |

---

## 🎯 Comandos Padrão

### Iniciar Sessão
```
Leia .ai-factory/FACTORY.CONFIG.md
Leia .ai-factory/agents/tech-lead.md
Assuma papel de Tech Lead
Scan tarefas pendentes
```

### Executar Tarefa
```
Leia .ai-factory/agents/{agente}.md
Execute tarefa X da área Y
Preencha RELATÓRIO V&V
Atualize LOG-VALIDACOES.md
```

### Relatório
```
Leia .ai-factory/agents/tech-lead.md
Gere relatório diário de melhorias
Atualize INDEX.md
```

---

## ⚠️ Anti-Patterns (NUNCA FAÇA)

- ❌ Pular V&V
- ❌ Marcar 🟢 sem validação
- ❌ Trabalhar sem orquestração do Tech Lead
- ❌ Ignorar prioridades (🔴🟠🟡🟢)
- ❌ Não registrar no LOG-VALIDACOES.md
- ❌ Commits grandes sem V&V
- ❌ Code review sem checklist V&V

---

## ✅ Checklists Obrigatórios

### Antes de Commit
- [ ] V&V executado (7 passos)
- [ ] RELATÓRIO V&V preenchido
- [ ] LOG-VALIDACOES.md atualizado
- [ ] Testes passando
- [ ] Linter sem erros
- [ ] Commit message no padrão Conventional Commits

### Antes de Merge
- [ ] Code review aprovado
- [ ] CI verde
- [ ] V&V ✅ APROVADO
- [ ] Testes de regressão adicionados
- [ ] INDEX.md atualizado

### Antes de Deploy
- [ ] QA go-ahead
- [ ] Security review (se crítico)
- [ ] Performance check
- [ ] Rollback testado
- [ ] Monitoring configurado

---

**Versão:** 1.0.0  
**Projeto:** POLYMARKETING  
**Última atualização:** 02/07/2026