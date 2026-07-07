# NexusAuto Wiki

Documentação automática gerada por NexusOpenWiki.

## Estrutura

- **README.md** - Visão geral da documentação
- **architecture/** - Arquitetura do sistema
- **agents/** - Documentação dos agentes
- **workflows/** - Fluxos de trabalho
- **api/** - Referência de API
- **memory/** - Sistema de memória
- **skills/** - Catálogo de skills
- **handoffs/** - Protocolos de handoff

## Atualização Automática

Esta wiki é atualizada automaticamente via GitHub Actions.

## Integração com Agentes

Os agentes do NexusAuto usam esta wiki para:
- Entender a arquitetura do sistema
- Localizar padrões e standards
- Encontrar exemplos de implementação
- Compreender fluxos de trabalho

## Comandos

```bash
# Gerar documentação inicial
node .ai-factory/tools/openwiki/openwiki.js --init

# Atualizar documentação
node .ai-factory/tools/openwiki/openwiki.js --update

# Modo interativo
node .ai-factory/tools/openwiki/openwiki.js --chat

# One-shot
node .ai-factory/tools/openwiki/openwiki.js -p "Descreva a arquitetura"
```

---

*Última atualização: 2026-07-07T10:12:09.535Z*
