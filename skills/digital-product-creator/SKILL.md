---
name: digital-product-creator
description: "Criação de produtos digitais vendáveis (ebooks, cursos, templates, infoprodutos)"
metadata:
  cow:
    emoji: "📦"
    requires:
      env:
        - OPENAI_API_KEY
        - GEMINI_API_KEY
---

# Digital Product Creator 📦

Especialista em criar produtos digitais completos e vendáveis. Transforma conhecimento em ativos digitais com estrutura profissional, design atraente e pronto para comercialização.

## 🎯 Quando Usar

Use esta skill quando:
- Criar ebooks, guias, manuais técnicos
- Desenvolver cursos online (vídeo, texto, híbrido)
- Produzir templates (Notion, Canva, planilhas, documentos)
- Criar infoprodutos (checklists, worksheets, planners)
- Empacotar conhecimento em formatos comercializáveis
- Estruturar produtos para plataformas (Hotmart, Gumroad, Teachable)

## 📋 Tipos de Produtos

### 1. Ebooks & Livros Digitais

**Estrutura Padrão:**
```markdown
- Capa (título + subtítulo + autor)
- Página de rosto
- Copyright e avisos legais
- Sumário interativo
- Introdução (problema + promessa)
- Capítulos (5-12 capítulos)
- Conclusão + Call-to-Action
- Sobre o autor
- Bônus (opcional)
```

**Comandos:**
```bash
# Gerar ebook completo
node scripts/digital-product.js create ebook \
  --title "Nome do Ebook" \
  --topic "Tópico principal" \
  --audience "Público-alvo" \
  --chapters 8 \
  --format markdown

# Gerar apenas outline
node scripts/digital-product.js outline ebook \
  --topic "Tópico" \
  --target-outcome "Resultado que o leitor terá"
```

**Output:**
- `products/[product-name]/ebook/`
  - `outline.md` (estrutura detalhada)
  - `chapters/` (capítulos individuais)
  - `cover-brief.md` (briefing para capa)
  - `marketing-copy.md` (texto de vendas)

### 2. Cursos Online

**Estrutura Padrão:**
```markdown
Módulo 1: Fundamentos
  - Aula 1.1: [Título] (vídeo + slides + transcript)
  - Aula 1.2: [Título] (vídeo + slides + transcript)
  - Quiz 1 (5-10 perguntas)
  - Exercício prático

Módulo 2: [Tópico Intermediário]
  ...

Módulo 3: [Tópico Avançado]
  ...

Bônus:
  - Checklist
  - Template
  - Comunidade
```

**Comandos:**
```bash
# Gerar curso completo
node scripts/digital-product.js create course \
  --title "Nome do Curso" \
  --outcome "O que aluno vai conseguir" \
  --modules 4 \
  --lessons-per-module 5 \
  --include-quizzes true

# Gerar roteiro de aula
node scripts/digital-product.js lesson-script \
  --module 1 \
  --lesson 2 \
  --topic "Tópico da aula" \
  --duration-minutes 15
```

**Output:**
- `products/[product-name]/course/`
  - `curriculum.md` (ementa completa)
  - `modules/[module-number]/` (módulos)
    - `lesson-[number].md` (roteiros)
    - `slides-[number].md` (slides em markdown)
    - `quiz-[number].md` (questionários)
  - `resources/` (materiais complementares)
  - `sales-page.md` (página de vendas)

### 3. Templates & Ferramentas

**Tipos Suportados:**
- Templates Notion (dashboards, planners, trackers)
- Planilhas Excel/Google Sheets (calculadoras, trackers)
- Templates Canva (posts, stories, apresentações)
- Documentos (contratos, propostas, briefings)
- Código (boilerplates, starters, componentes)

**Comandos:**
```bash
# Gerar template Notion
node scripts/digital-product.js create template \
  --type notion \
  --name "Dashboard de Produtividade" \
  --purpose "Gerenciar tarefas e hábitos" \
  --blocks database,kanban,calendar,habit-tracker

# Gerar planilha
node scripts/digital-product.js create template \
  --type spreadsheet \
  --name "Calculadora de Investimentos" \
  --formulas "juros-compostos,aporte-mensal,projecao"
```

**Output:**
- `products/[product-name]/template/`
  - `template.[ext]` (arquivo do template)
  - `instructions.md` (como usar)
  - `video-tutorial.md` (roteiro de tutorial)
  - `examples/` (exemplos de uso)

### 4. Infoprodutos Rápidos

**Formatos:**
- Checklists (5-20 itens)
- Worksheets (exercícios guiados)
- Planners (diário, semanal, mensal)
- Swipe files (modelos prontos)
- Cheat sheets (referência rápida)
- Mini-cursos (3-5 aulas)

**Comandos:**
```bash
# Gerar checklist
node scripts/digital-product.js create checklist \
  --topic "Lançamento de Podcast" \
  --steps 15 \
  --format pdf

# Gerar worksheet
node scripts/digital-product.js create worksheet \
  --topic "Definição de Persona" \
  --exercises 5 \
  --include-examples true
```

## 🛠️ Scripts Disponíveis

| Script | Propósito | Uso |
|--------|-----------|-----|
| `digital-product.js create` | Cria produto completo | `node scripts/digital-product.js create [type] --options` |
| `digital-product.js outline` | Gera estrutura/outline | `node scripts/digital-product.js outline [type] --topic "X"` |
| `digital-product.js chapter` | Escreve capítulo específico | `node scripts/digital-product.js chapter --number 3 --topic "X"` |
| `digital-product.js lesson-script` | Roteiro de aula | `node scripts/digital-product.js lesson-script --module 1 --lesson 2` |
| `digital-product.js marketing` | Copy de vendas | `node scripts/digital-product.js marketing --product "X" --platform "hotmart"` |
| `digital-product.js bundle` | Cria bundle de produtos | `node scripts/digital-product.js bundle --products "ebook,course,template"` |

## 📐 Estrutura de Diretórios

```
products/
└── [product-name]/
    ├── outline.md              # Estrutura completa
    ├── content/                # Conteúdo principal
    │   ├── chapters/           # (ebooks)
    │   ├── modules/            # (cursos)
    │   └── templates/          # (templates)
    ├── bonuses/                # Bônus
    ├── marketing/              # Materiais de marketing
    │   ├── sales-page.md       # Página de vendas
    │   ├── email-sequence.md   # Sequência de emails
    │   ├── social-posts.md     # Posts para redes
    │   └── ad-copy.md          # Copy para anúncios
    ├── delivery/               # Entrega ao cliente
    │   ├── pdf/                # Versões em PDF
    │   ├── video/              # Vídeos (se houver)
    │   └── resources/          # Recursos adicionais
    └── platform/               # Configuração por plataforma
        ├── hotmart.md          # Instruções Hotmart
        ├── gumroad.md          # Instruções Gumroad
        └── teachable.md        # Instruções Teachable
```

## 🎨 Design & Formatação

### Capas de Ebook/Curso

**Briefing Padrão:**
```markdown
# Cover Brief

**Título:** [Nome do produto]
**Subtítulo:** [Promessa/benefício]
**Autor:** [Nome]

**Estilo Visual:**
- Tipo: [Minimalista, Bold, Ilustrado, Fotográfico]
- Cores: [Paleta de 2-3 cores]
- Elementos: [Ícones, formas, texturas]

**Referências:**
- [URL de inspiração 1]
- [URL de inspiração 2]

**Dimensões:**
- Ebook: 1600x2400px (3:4)
- Curso: 1280x720px (16:9)
- Thumbnail: 800x450px
```

**Comando para gerar imagem:**
```bash
# Usar skill image-generation
python skills/image-generation/scripts/generate.py \
  '{"prompt": "Minimalist book cover design, [descrição]", "size": "2K", "aspect_ratio": "3:4"}'
```

### Formatação de PDF

**Padrões:**
- Fonte: Inter, Roboto, ou Open Sans (12-14pt corpo)
- Títulos: 24-32pt (H1), 18-22pt (H2), 14-16pt (H3)
- Espaçamento: 1.5-1.6 entre linhas
- Margens: 2.5cm todas
- Cabeçalho: Título do capítulo
- Rodapé: Número de página

## 📝 Copy de Vendas

### Estrutura de Sales Page

```markdown
# [Nome do Produto]

## Headline (Promessa Principal)
[Resultado desejado] em [tempo] sem [dor comum]

## Subheadline
[Explicação de como] + [Prova social/credibilidade]

## O Problema
[Descrição da dor do cliente]

## A Solução
[Apresentação do produto]

## O Que Você Vai Receber
- Módulo/Ebook 1: [Benefício]
- Módulo/Ebook 2: [Benefício]
- Bônus 1: [Valor percebido]
- Bônus 2: [Valor percebido]

## Para Quem É
- [Perfil 1]
- [Perfil 2]
- [Perfil 3]

## Para Quem NÃO É
- [Perfil não ideal 1]
- [Perfil não ideal 2]

## Prova Social
- [Depoimento 1]
- [Depoimento 2]
- [Números: alunos, vendas, etc.]

## Sobre o Autor
[Bio com credibilidade]

## Garantia
[Termos da garantia: 7, 15, 30 dias]

## Preço
De: R$ [valor cheio]
Por: R$ [valor promocional]
ou [número]x de R$ [parcela]

## Call-to-Action
[Botão: "Quero Garantir Minha Vaga"]

## FAQ
[Perguntas frequentes]
```

### Sequência de Emails

**Email 1 - Anúncio (Day 0):**
- Assunto: [Novidade importante]
- Conteúdo: Anúncio do lançamento + link

**Email 2 - Benefícios (Day 1):**
- Assunto: [Como conseguir X sem Y]
- Conteúdo: Educação + soft sell

**Email 3 - Prova Social (Day 2):**
- Assunto: [O que [pessoa] conseguiu]
- Conteúdo: Depoimentos + casos

**Email 4 - Urgência (Day 3):**
- Assunto: [Últimas horas]
- Conteúdo: Escassez + CTA forte

## 🚀 Lançamento

### Checklist de Lançamento

**Pré-Lançamento (7 dias antes):**
- [ ] Produto finalizado e revisado
- [ ] Capa/design aprovado
- [ ] Página de vendas publicada
- [ ] Checkout configurado (Hotmart/Gumroad)
- [ ] Email sequência pronta
- [ ] Posts de redes sociais agendados
- [ ] Tráfego pago configurado (se houver)
- [ ] Lista de emails segmentada

**Dia do Lançamento:**
- [ ] Email 1 enviado (anúncio)
- [ ] Posts publicados (Instagram, LinkedIn, Twitter)
- [ ] Anúncios ativos
- [ ] Suporte pronto para dúvidas
- [ ] Monitorar conversões

**Pós-Lançamento (3 dias):**
- [ ] Email 2 enviado (benefícios)
- [ ] Email 3 enviado (prova social)
- [ ] Email 4 enviado (urgência)
- [ ] Coletar feedback dos compradores
- [ ] Analisar métricas (conversão, CAC, LTV)

## 💰 Precificação

### Estratégias

**Baseado em Valor:**
- Ebook: R$ 27-97
- Curso básico: R$ 97-297
- Curso completo: R$ 297-997
- Mentoria/Grupo: R$ 997-2997
- Bundle: 2-3x valor individual

**Baseado em Concorrência:**
```bash
# Pesquisar preços similares
node scripts/digital-product.js research pricing \
  --niche "marketing digital" \
  --product-type "curso" \
  --platforms "hotmart,udemy,teachable"
```

**Testes A/B:**
- Testar 2-3 faixas de preço
- Rodar por 7-14 dias cada
- Medir conversão e receita total
- Escolher preço com maior receita (não necessariamente mais vendas)

## 📊 Métricas de Sucesso

| Métrica | Fórmula | Benchmark |
|---------|---------|-----------|
| Conversão | Vendas / Visitantes | 1-5% |
| Ticket Médio | Receita / Vendas | R$ 97-297 |
| CAC | Gasto Marketing / Vendas | < 30% ticket |
| LTV | Receita Total / Clientes | 3x CAC mínimo |
| Reembolso | Reembolsos / Vendas | < 5% |
| NPS | (Promotores - Detratores) / Total | > 50 |

## 🔗 Integração com Plataformas

### Hotmart

**Configuração:**
1. Criar produto em `produtos > criar produto`
2. Upload dos arquivos (PDF, vídeos)
3. Configurar preço e parcelamento
4. Configurar afiliados (se houver)
5. Obter link de checkout
6. Inserir na sales page

**Comando:**
```bash
node scripts/digital-product.js platform hotmart \
  --product "nome-do-produto" \
  --price 97.00 \
  --installments 3 \
  --affiliates true
```

### Gumroad

**Configuração:**
1. Criar produto em `Products > New Product`
2. Tipo: Digital Product
3. Upload files
4. Set price (ou Pay-what-you-want)
5. Customize product page
6. Publish e obter link

### Teachable / Kajabi

**Configuração:**
1. Criar curso
2. Adicionar módulos e aulas
3. Upload vídeos (ou embed do Vimeo/Wistia)
4. Configurar pricing
5. Customize course page
6. Publish

## 🧪 Validação de Produto

### Validação Rápida (Antes de Criar)

1. **Pesquisa de Audiência:**
```bash
node scripts/digital-product.js validate survey \
  --question "Qual seu maior desafio com [tópico]?" \
  --platform "instagram,email,twitter"
```

2. **Pré-venda:**
- Criar sales page simples
- Oferecer preço de fundador (50% off)
- Validar com 10+ vendas antes de produzir

3. **MVP:**
- Criar versão mínima (ex: 3 módulos de 10)
- Vender como beta
- Coletar feedback
- Expandir baseado em demandas

### Métricas de Validação

- **Interesse:** 100+ leads em lista de espera
- **Conversão:** 10+ vendas na pré-venda
- **Satisfação:** NPS > 50 dos primeiros compradores
- **Refund:** < 5% de reembolsos

## 📚 Exemplos de Produtos

### Exemplo 1: Ebook de Marketing

```
Produto: "Instagram para Negócios"
Formato: Ebook (80 páginas)
Preço: R$ 47
Bônus: Checklist de Posts, 30 Templates Canva
Plataforma: Hotmart
Meta: 100 vendas/mês
```

### Exemplo 2: Curso de Programação

```
Produto: "Python do Zero ao Profissional"
Formato: Curso (6 módulos, 30 aulas)
Preço: R$ 297
Bônus: Projetos Práticos, Comunidade Discord
Plataforma: Teachable
Meta: 50 vendas/mês
```

### Exemplo 3: Template Pack

```
Produto: "Notion Productivity System"
Formato: Template Notion + Video Tutorial
Preço: $29 USD
Bônus: Guide de Implementação
Plataforma: Gumroad
Meta: 200 vendas/mês
```

## ⚠️ Boas Práticas

### ✅ Fazer
- Validar demanda antes de produzir
- Focar em resultado específico e mensurável
- Incluir bônus de alto valor percebido
- Oferecer garantia de 7-30 dias
- Coletar e usar depoimentos
- Atualizar produto periodicamente
- Criar sequência de onboarding

### ❌ Não Fazer
- Criar produto sem validar audiência
- Prometer resultados irreais
- Entregar conteúdo raso/genérico
- Esquecer de criar materiais de marketing
- Ignorar feedback dos alunos
- Copiar conteúdo de concorrentes
- Abandonar produto após lançamento

## 🔧 Comandos Rápidos

```bash
# Criar ebook
node scripts/digital-product.js create ebook \
  --title "Nome" \
  --topic "Tópico" \
  --chapters 8

# Criar curso
node scripts/digital-product.js create course \
  --title "Nome" \
  --outcome "Resultado" \
  --modules 4

# Criar template
node scripts/digital-product.js create template \
  --type notion \
  --name "Nome" \
  --purpose "Propósito"

# Gerar copy de vendas
node scripts/digital-product.js marketing \
  --product "nome" \
  --platform "hotmart"

# Pesquisar preços
node scripts/digital-product.js research pricing \
  --niche "nich" \
  --product-type "tipo"

# Validar ideia
node scripts/digital-product.js validate \
  --idea "descrição" \
  --method survey
```

## 📞 Suporte

Para dúvidas sobre criação de produtos:
1. Verificar exemplos em `products/examples/`
2. Consultar templates em `products/templates/`
3. Revisar checklist de lançamento
4. Analisar métricas de produtos existentes

---

**Versão:** 1.0.0  
**Autor:** NexusAuto AI Factory  
**Última Atualização:** Julho 2026