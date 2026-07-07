# OpenWiki Plan

## 1. Stack Tecnológico
- **Linguagem:** TypeScript / Node.js
- **Localização:** `scripts/openwiki/` ou como um pacote standalone dentro do NexusAuto.
- **Bibliotecas:** `commander` (CLI), `inquirer` (interativo), `@langchain/core` (integração IA e LangSmith).

## 2. Arquitetura
1. **Config Manager:** Lê/Salva configs locais (ex: `~/.openwiki_config.json` ou `.env.openwiki`).
2. **Scanner:** Módulo que lê a estrutura do repositório, ignora arquivos binários e cria um mapa mental.
3. **LLM Engine:** Classe que se comunica com o provedor escolhido (OpenAI/Anthropic/Gemini) para gerar documentação baseada no scan.
4. **Markdown Writer:** Responsável por atualizar `AGENTS.md` e `CLAUDE.md` mantendo o padrão da AI Factory.

## 3. Integração com NexusAuto
O OpenWiki rodará como uma extensão do orquestrador (Tech Lead). Pode ser chamado durante o `SessionStart Hook` descrito no `TECH-LEAD.md`.
