---
title: NexusAuto Context & Memory Management
description: Regras de gestão de contexto (Claude-Mem) e validação de pacotes (Context7).
tags: [memory, backend, context, v&v, claude-mem, context7]
---

# Gestão de Memória e Validação de Contexto (Backend & Integrações)

Este documento estabelece as regras de ouro para o fluxo de contexto dos agentes, evitando degradação de memória em sessões longas e alucinações de código legado.

## 1. Regra de Atualização de Pacotes (Padrão Context7)
Para manter o repositório atualizado sem quebrar funcionalidades por "alucinação de API", todos os agentes devem seguir o protocolo Context7 no **Passo 1 do V&V (Validação & Verificação)**:

- **Não confie cegamente na sua memória de treinamento** quando lidar com bibliotecas em rápida evolução (ex: Drizzle ORM, Prisma, Next.js App Router, Tailwind v4).
- Sempre faça uma busca rápida na base de conhecimento ou pesquise (via *search_web*) a documentação mais atualizada do pacote.
- Quando invocado o hook `PreBackendEdit`, considere-o um bloqueio (gate): valide as assinaturas dos métodos antes de implementá-los no `backend/**/*.ts`.

## 2. Protocolo de Compressão de Sessão (Padrão Claude-Mem)
Para prevenir que os modelos percam o contexto e o repositório exceda o limite de processamento, a técnica do repositório `claude-mem` está nativamente mapeada nos arquivos de sistema do NexusAuto:

- **O cache quente (`session/hot.md`):** É estritamente para o "agora". Deve conter o objetivo atual, a feature em andamento e o bloqueio atual. 
  - **Obrigatório:** O limite absoluto é de ~500 tokens.
  - No encerramento (ou pausa) de uma sessão, o agente atual **deve** usar IA para ler o progresso feito e resumi-lo de forma extremante concisa. Substitua verbosidade por pragmatismo (ex: *"Migração do Drizzle concluída nas tabelas X e Y"* ao invés de detalhar o script).
  
- **O cofre de logs (`session/log.md`):** É *append-only* (apenas adição). Toda decisão arquitetural de impacto que precisou ser comprimida e removida do `hot.md` deve ir parar no `log.md`. Dessa forma, o contexto detalhado não é apagado, apenas movido para o armazenamento a frio.

## 3. Checklist do Agente de Backend / Orquestrador
- [ ] Antes de criar a infraestrutura, a documentação dos componentes-chave foi confirmada (Context7)?
- [ ] No hook de Stop/Pause, o estado atual foi sumarizado de forma agressiva (compressão) e salvo no `hot.md` (Claude-Mem)?
- [ ] Os rastros de decisões e códigos longos foram registrados no `log.md` para não poluir o cache da próxima sessão?
