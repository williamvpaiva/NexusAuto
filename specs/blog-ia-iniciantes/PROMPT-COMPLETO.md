# 🚀 Prompt: Desenvolvimento Completo - Blog de IA para Iniciantes

## 📋 CONTEXTO DO PROJETO

Você é um equipe completa de desenvolvimento (Tech Lead, Backend Dev, Frontend Dev, SEO Specialist, Content Strategist) que vai construir um **blog monetizado sobre Inteligência Artificial para Iniciantes** do zero ao deploy.

**Objetivo:** Criar uma fonte de renda passiva através de Google AdSense e programas de afiliados.

**Stack Tecnológico:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Contentlayer (MDX para posts)
- Deploy na Vercel
- Google AdSense + Afiliados (Hotmart, Udemy, SaaS)

**Metas de Receita:**
- Mês 3: R$ 350-500/mês
- Mês 6: R$ 2.000-3.000/mês
- Mês 12: R$ 8.000-10.000/mês

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### **FASE 1: Setup do Projeto (Dia 1-2)**

**Tarefas:**
1. Criar projeto Next.js 15 com TypeScript e Tailwind CSS
2. Configurar estrutura de diretórios otimizada para blog
3. Instalar e configurar Contentlayer para MDX
4. Configurar ESLint + Prettier
5. Criar scripts de desenvolvimento e build

**Estrutura de Arquivos Esperada:**
```
ia-iniciante/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── categorias/[categoria]/page.tsx
│   ├── ferramentas/page.tsx
│   ├── sobre/page.tsx
│   ├── contato/page.tsx
│   └── privacy-policy/page.tsx
├── content/posts/ (MDX files)
├── components/
│   ├── ui/
│   ├── blog/
│   ├── ads/
│   └── affiliate/
├── lib/
└── public/
```

**Critérios de Aceite:**
- [ ] Projeto compila sem erros
- [ ] `npm run dev` funciona
- [ ] `npm run build` funciona
- [ ] ESLint configurado e passando

---

### **FASE 2: Sistema de Conteúdo (Dia 3-4)**

**Tarefas:**
1. Configurar Contentlayer schema para posts
2. Criar tipos TypeScript para posts (Frontmatter)
3. Implementar sistema de categorias e tags
4. Criar funções utilitárias para buscar posts
5. Configurar MDX components customizados

**Schema do Post (Frontmatter):**
```typescript
interface Post {
  _id: string
  _raw: {
    flattenedPath: string
    sourceFilePath: string
    sourceFileDir: string
    sourceFileName: string
  }
  title: string
  slug: string
  description: string
  date: string
  updatedDate?: string
  author: string
  category: 'fundamentos' | 'ferramentas' | 'prompts' | 'trabalho' | 'criativa' | 'comparativos'
  tags: string[]
  image?: string
  imageAlt?: string
  draft?: boolean
  featured?: boolean
}
```

**Critérios de Aceite:**
- [ ] Posts em MDX são compilados corretamente
- [ ] Frontmatter é tipado e validado
- [ ] Categorias e tags funcionam
- [ ] Posts draft não aparecem em produção

---

### **FASE 3: Layout e Componentes Base (Dia 5-7)**

**Tarefas:**
1. Criar Header responsivo com navegação
2. Criar Footer com links legais e sociais
3. Desenvolver Homepage com:
   - Hero section com CTA
   - Grid de categorias (6 cards)
   - Posts recentes (grid 3 colunas)
   - Seção de newsletter
4. Criar layout de post individual otimizado para:
   - Leitura (tipografia, espaçamento)
   - AdSense (slots estratégicos)
   - Afiliados (boxes destacados)
5. Implementar Table of Contents automático
6. Criar sistema de navegação entre posts

**Componentes Obrigatórios:**
- `Header.tsx` (logo, menu mobile, busca)
- `Footer.tsx` (links, social, copyright)
- `Hero.tsx` (homepage)
- `CategoryGrid.tsx` (6 categorias)
- `PostGrid.tsx` (lista de posts)
- `PostCard.tsx` (card individual)
- `PostLayout.tsx` (template de post)
- `TableOfContents.tsx` (índice automático)
- `AuthorBio.tsx` (biografia do autor)
- `RelatedPosts.tsx` (posts relacionados)
- `NewsletterSignup.tsx` (captura de emails)

**Critérios de Aceite:**
- [ ] Layout responsivo (mobile, tablet, desktop)
- [ ] Score PageSpeed Insights > 90
- [ ] Navegação funciona em mobile
- [ ] Tipografia legível (mínimo 16px body)

---

### **FASE 4: Componentes de Monetização (Dia 8-9)**

**Tarefas:**
1. Criar componentes AdSense:
   - `AdBanner.tsx` (header, 728x90)
   - `AdInArticle.tsx` (dentro do conteúdo, 300x250)
   - `AdSidebar.tsx` (sidebar, 300x600)
   - `AdAnchor.tsx` (mobile, anchor)
   - `AdVignette.tsx` (mobile, vignette)
2. Criar componentes de afiliados:
   - `AffiliateBox.tsx` (box destacado com CTA)
   - `ProductCard.tsx` (card de produto com preço)
   - `ComparisonTable.tsx` (tabela comparativa)
   - `AffiliateDisclosure.tsx` (aviso legal)
3. Implementar sistema de tracking de cliques
4. Configurar posicionamento automático de ads

**Exemplo AffiliateBox:**
```tsx
// Deve incluir:
- Título da ferramenta
- Descrição curta (2-3 linhas)
- Logo/imagem do produto
- Lista de benefícios (3-5 itens)
- Preço/plano
- Botão CTA com link de afiliado
- Aviso "Link afiliado"
```

**Critérios de Aceite:**
- [ ] Ads não quebram layout mobile
- [ ] AffiliateBox é visualmente destacado
- [ ] Links de afiliado abrem em nova aba
- [ ] Disclosure visível em páginas de afiliados

---

### **FASE 5: SEO e Performance (Dia 10-11)**

**Tarefas:**
1. Configurar next-seo para meta tags automáticas
2. Implementar schema.org structured data:
   - Article schema para posts
   - FAQ schema para posts com FAQ
   - BreadcrumbList schema
   - Organization schema
3. Gerar sitemap.xml dinâmico
4. Configurar robots.txt
5. Otimizar imagens (next/image, WebP, lazy loading)
6. Implementar preloading de fonts
7. Configurar canonical URLs
8. Criar Open Graph images dinâmicas

**Meta Tags por Página:**
- Homepage: Título, descrição, keywords
- Post: Título, descrição, autor, data, imagem OG
- Categoria: Título, descrição da categoria
- Ferramentas: Título, descrição, produto

**Critérios de Aceite:**
- [ ] Google Search Console valida sitemap
- [ ] Rich results test passa para Article schema
- [ ] PageSpeed Insights > 90 (mobile e desktop)
- [ ] Open Graph preview funciona no Twitter/Facebook

---

### **FASE 6: Sistema de Blog (Dia 12-14)**

**Tarefas:**
1. Criar página de lista de posts (`/blog`)
   - Paginação (10 posts por página)
   - Filtros por categoria
   - Ordenação (data, popularidade)
2. Criar página de categoria (`/categorias/[slug]`)
3. Criar página de tag (`/tags/[slug]`)
4. Implementar sistema de busca
5. Criar página de autor (`/autor/[slug]`)
6. Implementar comentários (opcional: Giscus, Disqus)
7. Criar RSS feed

**Funcionalidades de Lista:**
- Paginação funcional
- Filtro por categoria ativo
- Search com debounce
- Empty state quando não há resultados
- Loading states

**Critérios de Aceite:**
- [ ] Paginação funciona corretamente
- [ ] Filtros atualizam URL e resultados
- [ ] Busca retorna resultados relevantes
- [ ] RSS feed valida no Feed Validator

---

### **FASE 7: Conteúdo Inicial (Dia 15-21)**

**Tarefas:**
1. Escrever e publicar 15 posts iniciais (mínimo para AdSense)
2. Otimizar cada post para SEO on-page
3. Adicionar imagens otimizadas em cada post
4. Inserir slots de AdSense estrategicamente
5. Adicionar affiliate boxes onde relevante
6. Criar páginas legais obrigatórias:
   - Política de Privacidade
   - Termos de Uso
   - Sobre o Blog
   - Contato
   - Divulgação de Afiliados

**Lista de Posts Iniciais (Prioridade):**

**Fundamentos (5 posts):**
1. "O que é Inteligência Artificial? Guia Completo para Iniciantes"
2. "ChatGPT: O Que É e Como Usar (Passo a Passo 2026)"
3. "10 Ferramentas de IA Grátis que Você Precisa Conhecer"
4. "Prompt Engineering para Iniciantes: Como Falar com a IA"
5. "IA Vai Substituir Meu Emprego? O Que Você Precisa Saber"

**Tutoriais (5 posts):**
6. "Como Criar Imagens com IA: Midjourney vs DALL-E 3 vs Stable Diffusion"
7. "Como Usar IA para Escrever Melhores Emails"
8. "Como Criar um Currículo com IA (Exemplos Práticos)"
9. "IA para Estudantes: 15 Ferramentas que Vão Salvar Sua Vida"
10. "10 Prompts Prontos do ChatGPT para Usar Hoje"

**Reviews (5 posts):**
11. "Melhores Cursos de IA para Iniciantes (2026)"
12. "Jasper AI Review: Vale a Pena em 2026?"
13. "Copy.ai Review: Alternativa Barata ao Jasper?"
14. "Notion AI Review: Produtividade ou Hype?"
15. "Grammarly Premium Vale a Pena? Review Completo"

**Critérios de Aceite:**
- [ ] 15 posts publicados e indexáveis
- [ ] Cada post tem mínimo 1.500 palavras
- [ ] Cada post tem imagem de capa
- [ ] Cada post tem 2-3 internal links
- [ ] Cada post tem meta title e description únicos
- [ ] Páginas legais publicadas

---

### **FASE 8: Analytics e Monitoramento (Dia 22-23)**

**Tarefas:**
1. Configurar Google Analytics 4
2. Configurar Google Search Console
3. Configurar Google AdSense (após aprovação)
4. Criar dashboard de métricas principais
5. Implementar event tracking:
   - Cliques em links de afiliados
   - Inscrições na newsletter
   - Downloads de materiais
   - Tempo de leitura
6. Configurar Google Tag Manager (opcional)

**Métricas para Acompanhar:**
- Pageviews por página
- Taxa de rejeição
- Tempo médio na página
- CTR de ads
- Cliques em afiliados
- Posições no Google (keywords)

**Critérios de Aceite:**
- [ ] GA4 registrando pageviews corretamente
- [ ] Search Console validado e sitemap enviado
- [ ] Event tracking funcionando
- [ ] Dashboard de métricas acessível

---

### **FASE 9: Deploy e Lançamento (Dia 24-28)**

**Tarefas:**
1. Configurar repositório GitHub
2. Conectar projeto na Vercel
3. Configurar domínio customizado
4. Configurar variáveis de ambiente
5. Deploy de produção
6. Testar todas as funcionalidades em produção
7. Aplicar para Google AdSense
8. Cadastrar em programas de afiliados:
   - Hotmart
   - Udemy
   - Jasper.ai
   - Copy.ai
   - Amazon Associates
9. Criar contas em redes sociais (Twitter, LinkedIn, Instagram)
10. Lançamento oficial

**Checklist Pré-Lançamento:**
- [ ] Build de produção passa
- [ ] Todas as páginas carregam
- [ ] Links internos funcionam
- [ ] Forms funcionam
- [ ] Analytics instalado
- [ ] Sitemap acessível
- [ ] Robots.txt configurado
- [ ] SSL ativo (HTTPS)
- [ ] Mobile responsivo
- [ ] PageSpeed > 85

**Critérios de Aceite:**
- [ ] Site acessível publicamente
- [ ] Domínio customizado configurado
- [ ] AdSense aplicado (aguardando aprovação)
- [ ] Pelo menos 3 programas de afiliados cadastrados
- [ ] Primeiras postagens em redes sociais feitas

---

### **FASE 10: Pós-Lançamento e Crescimento (Contínuo)**

**Tarefas Contínuas:**

**Semanal:**
- Publicar 2-3 novos posts
- Compartilhar posts em redes sociais
- Responder comentários
- Analisar Search Console (queries, CTR)

**Mensal:**
- Atualizar posts antigos (conteúdo, keywords)
- Analisar métricas de receita
- Otimizar CTR de ads
- Testar novos programas de afiliados
- Criar relatório de performance

**Trimestral:**
- Auditoria completa de SEO
- Redesign/otimização de páginas de baixa performance
- Pesquisa de novas keywords
- Planejamento de conteúdo do próximo trimestre

**Metas de Crescimento:**
- Mês 3: 5.000 pageviews/mês, R$ 350 receita
- Mês 6: 30.000 pageviews/mês, R$ 2.400 receita
- Mês 12: 100.000 pageviews/mês, R$ 8.000 receita

---

## 📊 ENTREGÁVEIS ESPERADOS

### **Código:**
- [ ] Projeto Next.js completo e funcional
- [ ] Todos os components implementados
- [ ] 15 posts iniciais em MDX
- [ ] Configuração de SEO completa
- [ ] Analytics configurado
- [ ] Scripts de automação (se necessário)

### **Documentação:**
- [ ] README.md com instruções de setup
- [ ] DOCUMENTACAO.md com guia de publicação de posts
- [ ] MONETIZACAO.md com lista de afiliados e configuração de ads
- [ ] SEO_CHECKLIST.md para otimização de posts

### **Infraestrutura:**
- [ ] Repositório GitHub configurado
- [ ] Projeto Vercel ativo
- [ ] Domínio configurado
- [ ] Variáveis de ambiente documentadas

### **Conteúdo:**
- [ ] 15 posts publicados
- [ ] 5 páginas legais (Sobre, Contato, Privacidade, Termos, Afiliados)
- [ ] Imagens otimizadas para todos os posts
- [ ] Meta tags configuradas para todas as páginas

---

## 🎨 DIRETRIZES DE DESIGN

### **Paleta de Cores:**
- Primária: `#2563EB` (azul confiável)
- Secundária: `#7C3AED` (roxo tecnológico)
- Accent: `#10B981` (verde sucesso/CTA)
- Background: `#FFFFFF` / `#F9FAFB`
- Texto: `#111827` / `#6B7280`

### **Tipografia:**
- Títulos: Inter (700, 600)
- Body: Inter (400, 500)
- Código: JetBrains Mono

### **Espaçamento:**
- Container máximo: `1200px`
- Padding lateral: `24px` (mobile), `32px` (desktop)
- Line height: `1.6` (body), `1.3` (títulos)

### **Componentes de Ad:**
- Não podem intrudar na leitura
- Devem ser claramente identificados como "Anúncio"
- Mobile: máximo 2 ads visíveis ao mesmo tempo
- Desktop: sidebar + in-article

---

## 🔒 REQUISITOS DE SEGURANÇA E COMPLIANCE

### **LGPD/GDPR:**
- [ ] Política de Privacidade clara
- [ ] Consentimento de cookies (banner)
- [ ] Opção de opt-out de analytics
- [ ] Não coletar dados desnecessários

### **AdSense Policies:**
- [ ] Conteúdo original (não copiado)
- [ ] Mínimo 20 posts de qualidade
- [ ] Navegação clara e intuitiva
- [ ] Site responsivo
- [ ] Páginas de contato e sobre visíveis

### **FTC (Afiliados):**
- [ ] Divulgação clara de links afiliados
- [ ] Aviso no topo ou rodapé de páginas com afiliados
- [ ] Não fazer claims falsos sobre produtos

---

## 📈 CRITÉRIOS DE SUCESSO

### **Técnicos:**
- ✅ Build passando sem erros
- ✅ PageSpeed Insights > 90
- ✅ Mobile responsivo
- ✅ SEO técnico 100%
- ✅ Analytics configurado

### **Conteúdo:**
- ✅ 15+ posts publicados
- ✅ Posts com 1.500+ palavras
- ✅ SEO on-page otimizado
- ✅ Imagens otimizadas

### **Monetização:**
- ✅ AdSense aplicado
- ✅ 3+ programas de afiliados cadastrados
- ✅ Ads posicionados estrategicamente
- ✅ Affiliate boxes implementados

### **Negócio:**
- ✅ Site no ar e indexado
- ✅ Primeiros visitantes orgânicos
- ✅ Primeiros cliques em ads/afiliados
- ✅ Plano de conteúdo para 90 dias

---

## 🚀 INSTRUÇÕES DE EXECUÇÃO

1. **Execute as fases em ordem** (1 → 10)
2. **Valide cada fase antes de prosseguir** (use os critérios de aceite)
3. **Priorize funcionalidade sobre perfeição** (lançar rápido, iterar depois)
4. **Documente decisões importantes** no README
5. **Teste em mobile constantemente**
6. **Não pule a fase de SEO** (é crítico para tráfego orgânico)
7. **Publique conteúdo antes de perfeccionar design**

---

## 📞 COMANDOS DISPONÍVEIS

Durante o desenvolvimento, você pode:

- `npm run dev` - Iniciar desenvolvimento
- `npm run build` - Build de produção
- `npm run lint` - Verificar código
- `npm run typecheck` - Verificar tipos TypeScript
- `node scripts/generate-post.js "titulo"` - Gerar template de post
- `node scripts/check-seo.js "slug"` - Auditar SEO de post

---

## 🎯 PRÓXIMO PASSO IMEDIATO

**Comece pela FASE 1: Setup do Projeto**

1. Crie o projeto Next.js
2. Configure a estrutura de diretórios
3. Instale dependências básicas
4. Valide que o build funciona

**Após completar, mova para FASE 2 e assim sucessivamente.**

**Importante:** Se encontrar bloqueios ou dúvidas, documente no README e continue para a próxima tarefa quando possível.

---

**Boa sorte! Vamos construir uma fonte de renda passiva de sucesso! 🚀**