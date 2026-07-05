# 15 — SEO E ANALYTICS

> Otimização para motores de busca, métricas de uso e analytics
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Baixa
> **Dependências:** 07-UI-COMPONENTS, 03-SISTEMAS

---

## 📋 Tarefas

### SEO-001 — Meta Tags e Open Graph
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar meta tags (title, description, keywords), Open Graph (og:title, og:description, og:image) e Twitter Cards no HTML head
- **Critério de aceite:** Compartilhamento em redes sociais exibe título, descrição e imagem corretos; validador OG não reporta erros
- **Esforço:** 1h
- **Prioridade:** Alta

### SEO-002 — Sitemap.xml e Robots.txt
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Gerar sitemap.xml dinâmico com todas as rotas públicas e robots.txt configurado (permitir crawlers, bloquear /api, /admin)
- **Critério de aceite:** GET /sitemap.xml retorna XML válido; GET /robots.txt retorna com regras; Google Search Console aceita ambos
- **Esforço:** 1h
- **Prioridade:** Alta

### SEO-003 — Analytics (Plausible ou similar)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Integrar ferramenta de analytics privacy-friendly (Plausible/Umami) para métricas de página, referrer, device e eventos custom
- **Critério de aceite:** Script analytics carrega sem bloquear render; dashboard mostra pageviews, bounce rate, top pages e devices
- **Esforço:** 2h
- **Prioridade:** Média

### SEO-004 — Performance Core Web Vitals
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Otimizar LCP, FID, CLS: lazy loading de imagens, preconnect para origins críticas, font-display: swap, tamanho explícito de assets
- **Critério de aceite:** Lighthouse Core Web Vitals verdes (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Esforço:** 3h
- **Prioridade:** Média

### SEO-005 — Structured Data (JSON-LD)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar JSON-LD structured data: Organization, WebSite, BreadcrumbList e SoftwareApplication (tipo SaaS)
- **Critério de aceite:** Teste de Rich Results do Google não reporta erros; schema.org/SoftwareApplication presente
- **Esforço:** 2h
- **Prioridade:** Baixa

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
