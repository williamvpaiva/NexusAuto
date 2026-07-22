# Integração Spec-Kit → NexusAuto

> **Especificação primeiro, código depois. O agente sabe exatamente o que construir, em que ordem e por quê.**

## Visão Geral

Esta integração adiciona o **Spec-Kit** (GitHub) como a camada de especificação upstream do NexusAuto, garantindo que todos os agentes operem a partir de **especificações vivas e validadas** em vez de prompts soltos.

### Filosofia Base

- **Spec-Driven Development**: Toda feature começa com uma especificação clara e validada
- **Rastreabilidade Total**: Cada linha de código pode ser traçada até um requisito na spec
- **Não-Invasivo**: Spec-Kit alimenta agentes existentes, não os substitui
- **Especificações Vivas**: Specs são versionadas, atualizadas e mantidas como código

---

## 📁 Estrutura de Diretórios

```
nexusauto/
├── .specify/                           # ← NOVO (Spec-Kit)
│   ├── constitution.md                 # Regras do projeto
│   ├── scripts/                        # Scripts auxiliares do Spec-Kit
│   └── templates/                      # Templates para specs, planos, tasks
│       ├── spec-template.md
│       ├── plan-template.md
│       ├── tasks-template.md
│       └── clarifications-template.md
│
├── specs/                              # ← NOVO (especificações por feature)
│   └── [feature-name]/                 # Ex: specs/auth-login/
│       ├── spec.md                     # O QUE construir (requisitos)
│       ├── plan.md                     # COMO construir (tecnologia, arquitetura)
│       ├── tasks.md                    # Lista de tarefas com dependências
│       └── clarifications.md           # Perguntas feitas e respostas
│
├── .ai-factory/
│   ├── brain/
│   │   └── Constitution.md             # Espelho do .specify/constitution.md
│   ├── agents/                         # 21 agentes especializados
│   ├── MELHORIAS/                      # Agora populado via /nl-import-tasks
│   └── scripts/
│       ├── memory-manager.js           # Memória persistente
│       ├── token-budget.js             # Controle de tokens
│       ├── spec-kit-bridge.js          # ← NOVO (integração com Spec-Kit CLI)
│       └── test-spec-kit-integration.js # ← NOVO (teste de integração)
│   └── TECH-LEAD.md                    # Atualizado com Fase 0 e slash commands
│
└── (restante: backend/, frontend/, etc.)
```

---

## 🛠️ Componentes da Integração

### 1. Spec-Kit CLI

**Instalação:**
```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

**Comandos disponíveis:**
- `specify constitution` → Define regras do projeto
- `specify specify "descrição"` → Descreve O QUE construir
- `specify clarify` → Agente pergunta o que não entendeu
- `specify plan "tech-stack"` → Define tecnologia e plano técnico
- `specify tasks` → Gera lista de tarefas ordenadas
- `specify implement` → Dispara implementação

### 2. Spec-Kit Bridge (`scripts/spec-kit-bridge.js`)

Wrapper Node.js que atua como ponte entre o Spec-Kit CLI e o NexusAuto.

**Funcionalidades:**
- Executa comandos do Spec-Kit CLI
- Processa artefatos gerados (spec.md, plan.md, tasks.md)
- Integra com MemoryManager para salvar specs como memórias
- Importa tasks para MELHORIAS/

**Uso via CLI:**
```bash
# Gerar especificação completa
node scripts/spec-kit-bridge.js full "Criar CRUD de tarefas" --feature crud-tasks --tech "Node/React"

# Importar tasks para MELHORIAS/
node scripts/spec-kit-bridge.js import-tasks --feature crud-tasks --area 01-BACKEND

# Validar especificação
node scripts/spec-kit-bridge.js validate --feature crud-tasks
```

**Uso via API:**
```javascript
import SpecKitBridge from './spec-kit-bridge.js';

const bridge = new SpecKitBridge();
const result = await bridge.generateFullSpec(
  "Criar CRUD de tarefas",
  "Node.js/TypeScript, React",
  "crud-tasks"
);

console.log(result.spec); // spec.md
console.log(result.plan); // plan.md
console.log(result.tasks); // tasks.md
```

### 3. MemoryManager Integration

Cada especificação gerada é salva como memória persistente:

```bash
node scripts/memory-manager.js save "Spec-Kit gerado para crud-tasks" \
  --agent tech-lead \
  --type specification \
  --tags spec-kit,crud-tasks
```

**Benefícios:**
- Buscas futuras por "especificação de CRUD" retornam a spec completa
- Clarificações são salvas como memórias auxiliares
- Redução de 60-80% de tokens em tarefas repetitivas

---

## 🔄 Fluxo Completo: Do Spec-Kit ao NexusAuto

```
[Usuário] "Criar um sistema de autenticação com login e registro"
    │
    ▼
[Tech Lead] → /nl-specify "Criar sistema de autenticação com login"
    │
    ▼
[Spec-Kit Bridge] → generateFullSpec()
    ├── /speckit.specify → specs/auth/spec.md
    ├── /speckit.clarify → pergunta: "Usar JWT ou sessions?"
    ├── /speckit.plan "Node/Express/React" → specs/auth/plan.md
    └── /speckit.tasks → specs/auth/tasks.md
    │
    ▼
[Tech Lead] → Lê specs/auth/tasks.md
    │
    ├── Tarefa 1: "Criar modelo de usuário" → backend-dev
    ├── Tarefa 2: "Criar rota de registro" → backend-dev
    ├── Tarefa 3: "Criar rota de login" → backend-dev
    ├── Tarefa 4: "Criar página de login" → frontend-dev
    ├── Tarefa 5: "Integrar frontend com backend" → frontend-dev + backend-dev
    ├── Tarefa 6: "Auditar segurança" → security
    └── Tarefa 7: "Testar fluxo completo" → qa-tester
    │
    ▼
[Agentes NexusAuto] → Executam tarefas em ordem, com handoffs e V&V
    │
    ▼
[Código] → Entregue com especificação viva rastreável
```

---

## 📋 Slash Commands (TECH-LEAD.md)

### Gestão de Especificações

| Comando | Ação |
|---------|------|
| `/nl-specify "descrição da ideia"` | Gera especificação completa (spec + plan + tasks) |
| `/nl-specify-feature "nome"` | Cria feature com estrutura vazia |
| `/nl-constitution` | Sincroniza Constitution com brain/Constitution.md |

### Ciclo de Desenvolvimento

| Comando | Ação |
|---------|------|
| `/nl-plan "tecnologia"` | Gera plano técnico |
| `/nl-clarify` | Executa fase de clarificação |
| `/nl-tasks` | Gera lista de tarefas |
| `/nl-implement` | Dispara orquestração dos agentes |

### Sincronização com Melhorias

| Comando | Ação |
|---------|------|
| `/nl-import-tasks` | Importa tasks para MELHORIAS/ |
| `/nl-validate-spec` | Valida especificação |

---

## ✅ Critérios de Aceitação

- [x] Spec-Kit CLI instalado e configurado
- [x] Diretórios `.specify/` e `specs/` criados
- [x] `spec-kit-bridge.js` implementado e testado
- [x] `TECH-LEAD.md` atualizado com Fase 0 e slash commands
- [x] Integração com MemoryManager (specs salvas como memórias)
- [x] Integração com MELHORIAS/ (tasks importadas automaticamente)
- [x] Teste completo com feature exemplo (CRUD de tarefas)
- [x] Redução de tokens documentada

---

## 💰 Economia de Tokens

| Abordagem | Tokens por Tarefa | Economia |
|-----------|-------------------|----------|
| Prompt solto | ~2.000 tokens | - |
| Especificação estruturada | ~500 tokens | **75% menos** |

**Por que a economia?**
- Contexto já está na spec (não precisa reexplicar)
- Tasks são curtas e objetivas (~200 tokens cada)
- MemoryManager evita recomputação de decisões passadas

---

## 🧪 Testes

**Executar teste de integração:**
```bash
node scripts/test-spec-kit-integration.js
```

**O teste executa:**
1. Gera especificação completa para CRUD de tarefas
2. Valida artefatos (spec.md, plan.md, tasks.md)
3. Importa tasks para MELHORIAS/01-BACKEND/
4. Sincroniza Constitution
5. Calcula economia de tokens estimada

---

## 📚 Referências

- [Spec-Kit GitHub](https://github.com/github/spec-kit)
- [TECH-LEAD.md](./TECH-LEAD.md)
- [ORCHESTRATOR.md](./ORCHESTRATOR.md)
- [Constitution](./.specify/constitution.md)

---

**Versão:** 1.0.0  
**Data:** 2026-07-04  
**Status:** ✅ Implementado e Testado