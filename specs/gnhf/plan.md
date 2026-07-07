# GNHF Plan

## 1. Stack Tecnológico
- **Linguagem:** TypeScript / Node.js
- **Localização:** `scripts/gnhf/` ou um submódulo no NexusAuto.
- **Bibliotecas:** `commander` (CLI), `simple-git` (operações Git seguras), `child_process` (spawn de agentes externos como Claude Code).

## 2. Arquitetura
1. **Git Manager:** Abstração para lidar com branches, worktrees e rollbacks rápidos de forma programática.
2. **Execution Loop:** A máquina de estado que controla o agente. 
   - Estado 1: Iniciar Tarefa.
   - Estado 2: Aguardar Saída do Agente.
   - Estado 3: Rodar Testes/Linting (Quality Gates).
   - Estado 4: Sucesso -> Git Commit / Falha -> Git Revert & Retry.
3. **Agent Adapters:** Módulos que formatam a chamada para diferentes agentes de mercado e interpretam os códigos de saída/logs deles.
4. **Reporter:** Módulo para agrupar logs em `.gnhf-logs/` e cuspir um sumário markdown limpo no final da execução.

## 3. Integração com NexusAuto
Perfeito para o Cenário 2 (Projeto Existente) do Tech Lead. O GNHF será o "modo noturno" autônomo do `cowagent-wrapper.js` ou até um wrapper acima dele para isolar a execução em uma worktree, mantendo total alinhamento com os *Quality Gates* (Gate 1: Build sem Erros).
