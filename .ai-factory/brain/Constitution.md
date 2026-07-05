# NexusAuto Constitution

> **Especificação primeiro, código depois. O agente sabe exatamente o que construir, em que ordem e por quê.**

## Princípios Fundamentais

1. **Spec-Driven Development**: Toda feature começa com uma especificação clara e validada
2. **Rastreabilidade Total**: Cada linha de código pode ser traçada até um requisito na spec
3. **Não-Invasivo**: Spec-Kit alimenta agentes existentes, não os substitui
4. **Especificações Vivas**: Specs são versionadas, atualizadas e mantidas como código

## Regras de Ouro

### 1. Estrutura de Especificação

Toda feature DEVE ter:
- `specs/[feature]/spec.md` → O QUE construir (requisitos, histórias de usuário, critérios de aceitação)
- `specs/[feature]/plan.md` → COMO construir (tecnologia, arquitetura, decisões técnicas)
- `specs/[feature]/tasks.md` → Lista de tarefas ordenadas com dependências
- `specs/[feature]/clarifications.md` → Perguntas feitas e respostas durante o desenvolvimento

### 2. Ciclo de Vida

```
Ideia → Spec (WHAT) → Plan (HOW) → Tasks → Implementação → Validação → Deploy
```

### 3. Integração com NexusAuto

- **Tech Lead**: Orquestra o fluxo Spec-Kit → Agentes
- **MemoryManager**: Salva specs como memórias persistentes
- **MELHORIAS/**: Recebe tasks geradas pelo Spec-Kit
- **Agentes**: Executam tasks com requisitos claros

### 4. Slash Commands

- `/nl-specify "descrição"` → Gera especificação completa
- `/nl-plan "tecnologia"` → Gera plano técnico
- `/nl-clarify` → Executa fase de clarificação
- `/nl-tasks` → Gera lista de tarefas
- `/nl-implement` → Dispara orquestração dos agentes
- `/nl-import-tasks` → Importa tasks para MELHORIAS/

### 5. Validação

Antes de implementar, verificar:
- [ ] `spec.md` contém histórias de usuário e critérios de aceitação
- [ ] `plan.md` define tecnologia e arquitetura
- [ ] `tasks.md` tem dependências claras
- [ ] Memória salva no MemoryManager

## Stack Padrão NexusAuto

- **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Tailwind CSS
- **Infra**: Docker + GitHub Actions + AWS/Azure
- **Qualidade**: ESLint + Prettier + Jest + Playwright

## Convenções

- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- **Branch Naming**: `feature/[nome]`, `fix/[nome]`, `hotfix/[nome]`
- **PR Requirements**: Spec vinculada, tests passing, V&V aprovado

---

**Versão**: 1.0.0  
**Sincronizado com**: `.ai-factory/brain/Constitution.md`