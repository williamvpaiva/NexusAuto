# OpenWiki Specification

## 1. Visão Geral
**Nome:** OpenWiki
**Objetivo:** Ferramenta CLI (Command Line Interface) que escaneia repositórios de código, gera documentação útil e atualizada para agentes de IA (como `AGENTS.md` e `CLAUDE.md`) e os mantém frescos.
**Problema:** Agentes de IA perdem contexto rapidamente ou não sabem as regras atuais do repositório.
**Usuários:** Desenvolvedores e agentes autônomos.

## 2. Requisitos Principais (Histórias de Usuário)
- Como desenvolvedor, quero rodar um comando `init` para configurar meu provedor de IA, chave de API e modelo, além do LangSmith.
- Como desenvolvedor, quero rodar a ferramenta e, se não houver documentação, ela deve criar uma pasta `.openwiki/` com documentação básica.
- Como desenvolvedor, quero que a ferramenta atualize `AGENTS.md` e `CLAUDE.md` baseado nos últimos commits ou mudanças.
- Como desenvolvedor, quero um modo interativo para conversar com o repositório.
- Como desenvolvedor, quero um modo one-shot para apenas passar um prompt e receber a saída (para automações de CI/CD).
- Como DevOps, quero um exemplo de workflow do GitHub Actions para criar PRs diários de atualização de documentação.

## 3. Critérios de Aceitação
- Deve funcionar no Windows, Linux e macOS via Node.js.
- Deve gerar arquivos Markdown amigáveis a agentes.
- A configuração deve ser salva localmente.
