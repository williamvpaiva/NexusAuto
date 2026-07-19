# NexusAuto Wiki — Catálogo Mestre

> Catálogo central de todo conhecimento persistente do projeto.

## Seções do Wiki

| Seção | Descrição | Link |
|-------|-----------|------|
| **Session** | Cache de continuidade + log de operações | [session/](session/) |
| **Overview** | Visão executiva do projeto | [overview.md](overview.md) |
| **Entities** | Pessoas, organizações, produtos, sistemas | [entities/](entities/_index.md) |
| **Concepts** | Ideias, padrões, frameworks, decisões | [concepts/](concepts/_index.md) |
| **Sources** | Documentos fonte ingeridos | [sources/](sources/_index.md) |
| **Decisions** | ADRs e decisões arquiteturais | [decisions/](decisions/) |
| **Architecture** | Arquitetura do sistema (auto-gerado) | [architecture/](architecture/INDEX.md) |
| **Memory** | Sistema de memória (auto-gerado) | [memory/](memory/INDEX.md) |
| **API** | Referência de API (auto-gerado) | [api/](api/INDEX.md) |
| **Economy** | Token economy reports | [economy/](economy/LATEST-REPORT.md) |

## Geração Automática

As seções **Architecture**, **Memory**, **API** e subdiretórios vazios (`agents/`, `skills/`, `workflows/`, `handoffs/`) são auto-gerados pelo OpenWiki.

**Não editar manualmente** os arquivos dentro de diretórios auto-gerados.

## Links Externos (Projeto)

| Documento | Localização |
|-----------|-------------|
| Contexto Base | [CONTEXT_SUMMARY.md](../../CONTEXT_SUMMARY.md) |
| Progresso | [PROGRESS.md](../../PROGRESS.md) |
| Instructions | [AGENTS.md](../../AGENTS.md) |
| OpenWiki | `tools/openwiki/` |
| GNHF | `tools/gnhf/` |
| V&V Protocol | `standards/VV_PROTOCOL_ADAPTATIVE.md` |
| Brain/Decisions | `brain/Key Decisions.md` |

## Regras do Wiki

1. **session/hot.md**: Sempre ≤500 tokens. Atualizado no hook `Stop`.
2. **session/log.md**: Append-only. Nunca editar entradas existentes.
3. **entities/**: Um arquivo por entidade. Nome no padrão `kebab-case.md`.
4. **concepts/**: Um arquivo por conceito. Nome no padrão `kebab-case.md`.
5. **sources/**: Fontes ingeridas, com metadados de origem e data.
6. **Seções auto-geradas**: Não editar manualmente.
