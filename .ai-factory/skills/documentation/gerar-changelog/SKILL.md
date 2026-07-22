---
name: gerar-changelog
description: "Gera changelog estruturado a partir do histórico de commits Git"
agent: qa-tester
tags: [documentation, changelog, git, release]
version: 1.0.0
created: 2026-01-04
updated: 2026-01-04
---

# Propósito
Gerar changelogs estruturados e padronizados seguindo o formato Keep a Changelog, extraindo automaticamente informações do histórico de commits Git e categorizando mudanças por tipo (Features, Bug Fixes, Breaking Changes, etc.).

# Trigger
Esta skill deve ser ativada quando:
- Solicitado para "gerar changelog"
- Mencionado "release notes", "mudanças da versão"
- Necessário documentar mudanças para release
- Palavras-chave: "changelog", "commits", "release", "versão"

# Instruções

## Passo 1: Obter Histórico de Commits
Extrair commits desde a última tag (ou data específica):
```bash
git log --oneline --decorate --no-merges $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~50")..HEAD
```

## Passo 2: Categorizar Commits
Classificar cada commit por tipo usando Conventional Commits:
- `feat:` → Features
- `fix:` → Bug Fixes
- `BREAKING CHANGE:` ou `!:` → Breaking Changes
- `docs:` → Documentation
- `refactor:` → Refactoring
- `perf:` → Performance
- `test:` → Tests
- `chore:` → Chores/Manutenção

## Passo 3: Extrair Informações
Para cada commit, extrair:
- Hash curto (7 caracteres)
- Mensagem do commit
- Autor
- Data
- Issue relacionada (se houver, ex: `#123`)

## Passo 4: Gerar Changelog
Criar arquivo `CHANGELOG.md` ou atualizar existente:

```markdown
# Changelog

## [1.2.0] - 2026-01-04

### Features
- Adicionar autenticação OAuth2 (#456) [`abc1234`](commit-link)
- Implementar cache de respostas (#445) [`def5678`](commit-link)

### Bug Fixes
- Corrigir vazamento de memória em uploads (#478) [`ghi9012`](commit-link)
- Resolver erro de CORS em produção (#467) [`jkl3456`](commit-link)

### Breaking Changes
- Mudar formato da resposta da API de usuários (#489) [`mno7890`](commit-link)

### Documentation
- Atualizar README com exemplos de uso (#432) [`pqr1234`](commit-link)

### Refactoring
- Extrair lógica de validação para módulo separado (#421) [`stu5678`](commit-link)

### Performance
- Otimizar queries de listagem (#456) [`vwx9012`](commit-link)
```

## Passo 5: Adicionar Links
Incluir no final do changelog:
```markdown
[Unreleased]: https://github.com/org/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/org/repo/compare/v1.1.0...v1.2.0
```

## Passo 6: Validar com Equipe
Antes de finalizar:
- Verificar se todas as issues fechadas estão documentadas
- Confirmar breaking changes com tech lead
- Validar números de issues/PRs

# Inputs
- `sinceTag` (string, opcional): Tag de referência (ex: `v1.1.0`)
- `sinceDate` (string, opcional): Data de referência (ex: `2026-01-01`)
- `outputFile` (string, opcional): Arquivo de saída (padrão: `CHANGELOG.md`)
- `includeLinks` (boolean, opcional): Incluir links para commits/PRs (padrão: true)

# Outputs
- Arquivo `CHANGELOG.md` atualizado
- Resumo de mudanças por categoria
- Lista de contributors do período

# Exemplos

## Exemplo 1: Changelog de Release
**Entrada:**
```
sinceTag: v1.1.0
outputFile: CHANGELOG.md
includeLinks: true
```

**Saída:**
```markdown
## [1.2.0] - 2026-01-04

### Features
- Implementar busca semântica com embeddings (#123) [`a1b2c3d`](https://github.com/org/repo/commit/a1b2c3d)
- Adicionar cache de respostas (#118) [`e4f5g6h`](https://github.com/org/repo/commit/e4f5g6h)

### Bug Fixes
- Corrigir erro de conexão com banco (#134) [`i7j8k9l`](https://github.com/org/repo/commit/i7j8k9l)

### Contributors
- @dev1 (5 commits)
- @dev2 (3 commits)
- @dev3 (2 commits)
```

## Exemplo 2: Changelog para Hotfix
**Entrada:**
```
sinceDate: 2026-01-03
outputFile: HOTFIX-CHANGELOG.md
```

# Dependências
- Git instalado e configurado
- Acesso ao repositório
- Tags seguindo padrão semver (recomendado)

# Links Relacionados
- [Patterns](../../../brain/Patterns.md) - Padrões de documentação
- [documentation](../../../standards/documentation.md) - Standards de documentação
- [github-create-issue](../../automation/github-create-issue/SKILL.md) - Criar issues de release