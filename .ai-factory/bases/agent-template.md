---
name: nome-do-agente
specialty: especialidade-principal
status: Ativo | Inativo | Em Pausa
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Agente: {Nome}

## Especialidade
Descrição curta da especialidade principal.

## Responsabilidades
- Responsabilidade 1
- Responsabilidade 2
- Responsabilidade 3

## Stack & Ferramentas
- **Linguagem**: Python / TypeScript / Go
- **Frameworks**: FastAPI / Express / React
- **Ferramentas**: Docker / Kubernetes / Terraform
- **APIs Externas**: OpenAI / Stripe / Twilio

## Pré-requisitos
- {Dependência 1} >= {versão}
- {Dependência 2} >= {versão}
- Variáveis de ambiente: {{VARIAVEL_1}}, {{VARIAVEL_2}}

## Arquitetura

```
{diagrama ou descrição de como o agente se conecta com outros}
```

### Handoffs

| Origem → Destino | Artefato | Gatilho |
|------------------|----------|---------|
| {agente A} → {agente B} | `caminho/arquivo` | Quando X acontecer |

## Uso

```bash
# Comando para ativar este agente
```

## Skills
- [skills/categoria/skill-1](../skills/categoria/skill-1/SKILL.md)
- [skills/categoria/skill-2](../skills/categoria/skill-2/SKILL.md)

## Histórico de Sessões
| Data | Tarefa | Resultado |
|------|--------|-----------|
| YYYY-MM-DD | Descrição | Success/Failure |

## Memórias Recentes
- [brain/Memories#sessão-x](../brain/Memories.md#sessão-x)
- [brain/Key Decisions#ADR-X](../brain/Key%20Decisions.md#ADR-X)

## Links Relacionados
- [brain/North Star](../brain/North%20Star.md)
- [org/Agents](../org/Agents.md)
- [brain/Skills](../brain/Skills.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Regras de contribuição
- [.github/ENV-GUIDE.md](../.github/ENV-GUIDE.md) — Padrão de variáveis de ambiente
