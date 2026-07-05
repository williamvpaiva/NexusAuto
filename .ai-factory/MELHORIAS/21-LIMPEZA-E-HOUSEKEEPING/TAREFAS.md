# 21 — LIMPEZA E HOUSEKEEPING

> Organização do repositório: remoção de código morto, padronização, linting e refatorações menores
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Média
> **Dependências:** Nenhuma

---

## 📋 Tarefas

### LIX-001 — Remover Código Morto e Comentários Obsoletos
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Varredura no código para remover: funções não utilizadas, imports órfãos, console.log esquecidos, comentários `// TODO` resolvidos e código comentado
- **Critério de aceite:** `npx ts-prune` reporta zero exports não utilizados; nenhum console.log em produção; imports limpos
- **Esforço:** 2h
- **Prioridade:** Alta

### LIX-002 — Padronizar Nomenclatura de Arquivos
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Unificar convenção de nomenclatura: kebab-case para arquivos, PascalCase para componentes/classes, camelCase para funções/variáveis, CONSTANT_CASE para enums
- **Critério de aceite:** ESLint rule `filenames/match-regex` ou similar; repo inteiro segue mesma convenção
- **Esforço:** 2h
- **Prioridade:** Alta

### LIX-003 — ESLint + Prettier Config Completa
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Configurar ESLint flat config (ou .eslintrc) com rules para TypeScript, React, imports, unicorn; Prettier integrado
- **Critério de aceite:** `npm run lint` passa sem erros; `npm run format` formata todo o repo; CI bloqueia se lint falhar
- **Esforço:** 2h
- **Prioridade:** Alta

### LIX-004 — Organizar Arquivos Soltos na Raiz
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Mover/agrupar arquivos soltos na raiz para pastas apropriadas: scripts → `/scripts`, configs → `/config`, docs → `/docs`
- **Critério de aceite:** Raiz do projeto contém apenas: README.md, package.json, docker-compose.yml, .gitignore, .env.example e pastas
- **Esforço:** 1h
- **Prioridade:** Alta

### LIX-005 — .gitignore Completo
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Revisar .gitignore para incluir: node_modules, .env, dist, coverage, .DS_Store, *.log, arquivos de IDE, diretórios de build
- **Critério de aceite:** `git status` não mostra node_modules, .env, dist; nenhum arquivo build/sensível trackeado
- **Esforço:** 30min
- **Prioridade:** Alta

### LIX-006 — EditorConfig + .gitattributes
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar .editorconfig (indent, charset, end of line) e .gitattributes (normalização LF/CRLF, diff linguagens)
- **Critério de aceite:** .editorconfig respeitado pela IDE; .gitattributes evita diff falso por CRLF
- **Esforço:** 30min
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
