# WIKI.md — Wiki Schema Reference

> Schema para o agente: estrutura e convenções do wiki persistente.

## Estrutura

```
wiki/
├── hot.md            # ~500 tokens, cache de continuidade entre sessões
├── index.md          # Catálogo mestre com links para todas as seções
├── log.md            # Append-only. Cada sessão adiciona, nunca edita.
├── overview.md       # Visão executiva do projeto
├── entities/         # Pessoas, orgs, produtos — um arquivo por entidade
│   └── _index.md
├── concepts/         # Ideias, padrões, frameworks — um arquivo por conceito
│   └── _index.md
├── sources/          # Fontes ingeridas (read-only após ingestão)
│   └── _index.md
├── meta/             # Dashboards, lint, health (auto-gerado)
└── decisions/        # ADRs e decisões arquiteturais
```

## Regras a Seguir

### hot.md
- Manter ≤500 tokens (leitura rápida no SessionStart)
- Atualizar no hook `Stop` com o resumo da sessão
- Incluir: foco ativo, decisões em andamento, tarefas pendentes

### log.md
- **Append-only**. Nunca alterar entradas existentes.
- Formato: `| timestamp | OPERATION | descrição concisa |`
- Prefixos de operação: WIKI-, HOOKS-, PLUGIN-, MEMORY-, DECISION-, SOURCE-

### entities/, concepts/
- Nomes em `kebab-case.md`
- Entries podem ter `aliases`, `related`, `context`, `status`
- Referências cruzadas com caminhos relativos: `[Nome](../entities/nome.md)`

### sources/
- Read-only após ingestão. Atualizações viram nova entrada.
- Metadados obrigatórios: título, URL, data, resumo

## Para o Agente
- No SessionStart: leia wiki/hot.md primeiro
- Se precisar de contexto: consulte wiki/index.md → navegue pelas seções
- Para registrar algo novo: crie arquivo em entities/ ou concepts/ e registre em log.md
- No final da sessão: atualize wiki/hot.md com o resumo
