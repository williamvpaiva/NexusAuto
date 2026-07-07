# GNHF Specification

## 1. Visão Geral
**Nome:** GNHF (Good Night, Have Fun)
**Objetivo:** Ferramenta CLI TypeScript que permite dar um objetivo em linguagem natural e manter um agente de código rodando em loop assíncrono em um repositório limpo, realizando pequenos commits documentados.
**Problema:** Tarefas longas exigem supervisão contínua. Sem supervisão, agentes podem quebrar o repositório irremediavelmente.
**Usuários:** Desenvolvedores e orquestradores (Tech Lead).

## 2. Requisitos Principais (Histórias de Usuário)
- Como desenvolvedor, quero rodar `gnhf "objetivo"`, e a ferramenta deve criar/usar uma branch limpa.
- O loop de agentes deve suportar múltiplos agentes (Claude Code, NexusAuto CowAgent, Copilot CLI, etc.).
- A ferramenta deve fazer commits após cada passo de sucesso.
- Se o agente falhar (ex: testes quebram), a ferramenta deve fazer um *rollback* seguro daquele passo e pedir para o agente tentar de novo ou parar após limites críticos.
- Deve ter opções para: iteracões máximas, limites de tokens, condições de parada e uso de git worktrees.
- Deve imprimir um resumo claro final de mudanças, logs e como revisar a branch.

## 3. Critérios de Aceitação
- Instalável via npm/script.
- Compatibilidade OS-agnóstica (Windows, macOS, Linux).
- Mecanismo sólido de rollback via `git reset` e verificações antes de commit.
