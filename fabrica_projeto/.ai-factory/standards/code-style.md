# Padrões de Código - Universal

## Princípios Fundamentais
1. **Clean Code** - Código legível é mais importante que código esperto
2. **SOLID** - Aplicar em toda estrutura orientada a objetos
3. **DRY** - Não repetir lógica, mas evitar abstração prematura
4. **KISS** - Solução mais simples que resolve o problema
5. **YAGNI** - Não implementar o que não foi pedido
6. **Boy Scout Rule** - Deixe o código melhor do que encontrou

## Nomenclatura

### Regras
- **Variáveis:** camelCase, descritivas - `userEmail`, `totalPrice`
- **Constantes:** UPPER_SNAKE_CASE - `MAX_RETRY_ATTEMPTS`
- **Funções:** camelCase, verbo + substantivo - `calculateTotal`, `getUserById`
- **Classes:** PascalCase, substantivo - `UserService`, `PaymentGateway`
- **Interfaces e Types:** PascalCase - `UserProps`, `CreateOrderDTO`
- **Componentes:** PascalCase - `UserCard.tsx`
- **Demais arquivos:** kebab-case - `user-service.ts`
- **Booleanos:** prefixo `is`, `has`, `can`, `should` - `isActive`, `hasPermission`
- **Handlers:** prefixo `handle` ou `on` - `handleSubmit`, `onUserClick`

### Proibido em Nomenclatura
- ❌ Abreviações obscuras: `usrSvc`, `qtd`, `aux`, `temp2`
- ❌ Nomes genéricos sem contexto: `data`, `info`, `manager`, `helper`
- ❌ Nomes de uma letra (exceto índices de loop `i`, `j`)
- ❌ Nomes enganosos: lista chamada `userMap`

## Estrutura de Funções
- **Máximo 20-30 linhas** por função (ideal < 15)
- **Máximo 3 parâmetros** (mais que isso usar objeto)
- **Um nível de abstração** por função
- **Early return** ao invés de nested ifs
- **Funções fazem uma coisa só**

## Comentários

### Fazer
- ✅ Comentar o **POR QUE**, não o QUE (o código já diz o que)
- ✅ Comentar decisões não óbvias e workarounds (com link para issue)
- ✅ Comentar regras de negócio complexas
- ✅ JSDoc e docstrings em APIs públicas

### Não Fazer
- ❌ Comentar código óbvio
- ❌ Manter código comentado (deletar, o Git lembra)

## Conventional Commits (obrigatório)

### Formato
```
tipo(escopo): descrição no imperativo
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem mudança de lógica)
- `refactor`: Refatoração (sem mudança de comportamento)
- `test`: Adição ou correção de testes
- `chore`: Build, configs, dependências
- `perf`: Melhoria de performance
- `ci`: Pipelines

### Regras de Commit
- ✅ Commits pequenos e atômicos (uma mudança lógica por commit)
- ✅ Descrição em português, imperativo, sem ponto final
- ✅ Máximo 72 caracteres no título
- ✅ Branch naming: `feat/US-001-login-oauth`, `fix/BUG-042-frete-rural`

## Pull Requests
- **PRs pequenos:** < 400 linhas alteradas (idealmente)
- **Mínimo 1 aprovação** antes de merge
- **CI verde** obrigatório
- **Squash merge** para manter histórico limpo

## Proibições Gerais
- ❌ `console.log` e `print` de debug em código commitado
- ❌ Codigo morto ou comentado
- ❌ Magic numbers (usar constantes nomeadas)
- ❌ `any` no TypeScript (usar `unknown` + narrowing)
- ❌ Catch vazio (silenciando erros)
- ❌ TODO sem issue associada (usar `TODO(US-123)`)
- ❌ Copiar-colar blocos de > 10 linhas (extrair função)