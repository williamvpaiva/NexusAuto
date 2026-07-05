---
name: doc-coauthoring
description: Guia estruturado para co-criação colaborativa de documentos. Walkthrough em 3 estágios: Context Gathering, Refinement & Structure, e Reader Testing. Use quando precisar criar documentos complexos com input do usuário.
---

# Doc Coauthoring

## Visão Geral

Esta skill fornece um workflow estruturado para guiar usuários através da criação colaborativa de documentos. Atue como um **guia ativo**, caminhando através de três estágios sequenciais.

**Palavras-chave**: escrita colaborativa, co-autoria, criação de documentos, documentação, estrutura de docs, review de leitor

---

## Estágio 1: Context Gathering

### Objetivo

Coletar informações fundamentais sobre o documento antes de começar a escrever.

### Questions Essenciais

#### 1. Propósito e Audiência

```
- Qual é o objetivo principal deste documento?
- Quem é o leitor primário? (cargo, nível técnico, contexto)
- O que o leitor deve saber/fazer/sentir após ler?
- Qual é o único takeaway mais importante?
```

#### 2. Escopo e Conteúdo

```
- Quais tópicos devem ser cobertos?
- Há conteúdo existente para referenciar? (links, arquivos, notes)
- Há restrições de tamanho ou formato?
- Há stakeholders que precisam aprovar?
```

#### 3. Tom e Estilo

```
- Qual é o tom desejado? (formal, casual, técnico, persuasivo)
- Há brand guidelines a seguir?
- Há exemplos de documentos similares que você gosta?
```

#### 4. Timeline e Processo

```
- Qual é o deadline?
- Quantas iterações/reviews são esperadas?
- Quem mais estará envolvido na criação/review?
```

### Output do Estágio 1

Gere um **Document Brief** estruturado:

```markdown
# Document Brief

## Purpose
[1-2 sentences]

## Audience
[Persona + contexto]

## Key Takeaways
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]

## Scope
- [Tópico 1]
- [Tópico 2]
- [Tópico 3]

## Constraints
- Formato: [tipo]
- Length: [palavras/páginas]
- Deadline: [data]

## Tone
[descrição]

## Stakeholders
[Nomes + roles]
```

### Gate para Próximo Estágio

Só prossiga quando:
- ✅ Brief está claro e específico
- ✅ Audiência está bem definida
- ✅ Conteúdo essencial está identificado
- ✅ Restrições estão documentadas

---

## Estágio 2: Refinement & Structure

### Objetivo

Transformar o brief em uma estrutura detalhada e começar a escrever conteúdo.

### Passo 1: Criar Outline Estruturado

```markdown
# [Título do Documento]

## Abstract/Executive Summary
[Esboço do resumo]

## Section 1: [Título]
### 1.1 [Subseção]
- Key point: [ponto principal]
- Evidence: [dados/exemplos]
- Transition: [como conecta à próxima seção]

### 1.2 [Subseção]
...

## Section 2: [Título]
...

## Conclusion
[Resumo dos pontos + call to action]

## Appendix (se necessário)
[Material suplementar]
```

### Passo 2: Review do Outline

Questions para o usuário:

```
1. A estrutura faz sentido lógico?
2. Há alguma seção faltando?
3. Alguma seção deveria ser removida?
4. A ordem está correta?
5. Há equilíbrio entre as seções?
```

### Passo 3: Drafting por Seção

Para cada seção:

1. **Escreva o conteúdo** seguindo o outline
2. **Inclua placeholders** para dados/imagens faltantes
3. **Adicione notes** para decisões que precisam de review
4. **Mantenha consistência** de tom e estilo

### Passo 4: First Full Draft

Compile todas as seções em um draft completo:

```markdown
# [Título Completo]

[Conteúdo completo]

---

## Notes for Review
- [ ] Dado X precisa ser verificado
- [ ] Imagem Y precisa ser adicionada
- [ ] Seção Z precisa de input do stakeholder
```

### Output do Estágio 2

- ✅ Outline aprovado
- ✅ First complete draft
- ✅ Lista de pending items

### Gate para Próximo Estágio

Só prossiga quando:
- ✅ Outline foi aprovado pelo usuário
- ✅ Draft está completo (mesmo com placeholders)
- ✅ Todos os pending items estão listados

---

## Estágio 3: Reader Testing

### Objetivo

Validar o documento através da perspectiva do leitor antes de finalizar.

### Técnica 1: Read-Through Simulado

Leia o documento e faça pause após cada seção:

```
Pause Points:
- Após o abstract: "O leitor entende o propósito?"
- Após cada seção: "Isso faz sentido? Há clareza?"
- Após a conclusão: "O call to action é claro?"
```

### Técnica 2: Checklist de Leitor

Para cada seção, avalie:

```markdown
## Seção [X]

- [ ] **Clareza**: Uma pessoa de [audiência] entenderia?
- [ ] **Relevância**: Isso serve ao propósito do doc?
- [ ] **Evidência**: Há dados/exemplos suficientes?
- [ ] **Transição**: Conecta bem com a próxima seção?
- [ ] **Tom**: Está consistente com o brief?
```

### Técnica 3: Gap Analysis

Identifique lacunas entre o que o documento diz e o que o leitor precisa saber:

```
Gaps Identificados:
1. [Gap 1]: [Como preencher]
2. [Gap 2]: [Como preencher]
3. [Gap 3]: [Como preencher]
```

### Técnica 4: Friction Points

Procure por pontos de fricção:

```
Friction Points:
- Jargão não definido: [lista]
- Assumptions não declaradas: [lista]
- Saltos lógicos: [lista]
- Ambiguidades: [lista]
```

### Passo Final: Revision Pass

Com base no reader testing:

1. **Preencha gaps** identificados
2. **Clarifique friction points**
3. **Refine transições** entre seções
4. **Verifique consistência** de tom e estilo
5. **Adicione/ajuste** call to action

### Output do Estágio 3

```markdown
# Documento Final

[Conteúdo completo e revisado]

---

## Change Log
- [Mudança 1]: [Razão]
- [Mudança 2]: [Razão]
- [Mudança 3]: [Razão]

## Reader Testing Summary
- Gaps filled: [número]
- Friction points resolved: [número]
- Clarity score: [auto-avaliação 1-10]
```

---

## Padrões de Escrita

### Títulos e Headings

```
✅ Bom:
- "Como Implementar Autenticação JWT"
- "Resultados do Q4 2025"
- "Guia de Migração: v2 → v3"

❌ Evite:
- "Introdução"
- "Conclusão"
- "Informações Diversas"
```

### Parágrafos

```
✅ Bom:
- 3-5 sentences por parágrafo
- Topic sentence clara
- Transição para próximo parágrafo

❌ Evite:
- Blocos de texto > 6 linhas
- Múltiplas ideias por parágrafo
- Transições abruptas
```

### Lists

```
✅ Bom:
- Items paralelos (mesma estrutura gramatical)
- 3-7 items por lista
- Intro sentence contextualizando

❌ Evite:
- Lists de 1 item
- Items com estruturas diferentes
- Lists dentro de lists (aninhadas demais)
```

### Calls to Action

```
✅ Bom:
- "Implemente o código acima e execute os testes"
- "Revise a seção 3 e envie feedback até sexta"
- "Compartilhe este doc com seu team lead"

❌ Evite:
- "Esperamos que isso seja útil"
- "Se você quiser, pode tentar"
- "Talvez considere fazer isso"
```

---

## Templates por Tipo de Documento

### Technical Documentation

```markdown
# [Feature/Component] Documentation

## Overview
[O que é + por que existe]

## Getting Started
[Quickstart em 5 minutos]

## API Reference
[Endpoints, parameters, examples]

## Examples
[Use cases comuns]

## Troubleshooting
[Problemas comuns + soluções]

## FAQ
[Perguntas frequentes]
```

### Business Proposal

```markdown
# [Project Name] Proposal

## Executive Summary
[1 paragraph: problema + solução + ask]

## Problem Statement
[Contexto + impacto]

## Proposed Solution
[Approach + timeline + resources]

## Investment
[Cost + ROI + alternatives]

## Next Steps
[Timeline + decision needed]
```

### Project Retrospective

```markdown
# [Project Name] Retrospective

## Summary
[O que foi + outcomes]

## What Went Well
[Successes + por que funcionou]

## What Could Improve
[Challenges + lessons]

## Data & Metrics
[Numbers que contam a história]

## Action Items
[O que vamos fazer diferente]
```

---

## Quando Usar Esta Skill

Use quando:

1. Criar documento complexo do zero
2. Precisar de input estruturado do usuário
3. Documentar processos, features, decisões
4. Escrever propostas ou business cases
5. Criar documentação técnica
6. Produzir relatórios ou retrospectives
7. Qualquer documento que beneficie de iteração colaborativa

**Trigger phrases**: "criar documento", "escrever doc", "co-author", "documentação", "proposta", "relatório", "estrutura de doc", "outline"