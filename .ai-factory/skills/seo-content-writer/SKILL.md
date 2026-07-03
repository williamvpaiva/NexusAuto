# seo-content-writer

## Purpose

Criação e otimização de conteúdo para mecanismos de busca. Esta skill produz conteúdo SEO-optimized que rankeia bem no Google, Bing e outros buscadores. Inclui pesquisa de keywords, otimização on-page, estrutura de tópicos, meta tags, e estratégias de link building.

## When to Use This Skill

This skill should be used when:
- User needs to create blog posts or articles optimized for search engines
- User wants to optimize existing content for better rankings
- User needs keyword research and competitive analysis
- User wants to improve organic traffic
- User needs meta descriptions and title tags
- User wants to implement content clusters and topic authority
- User needs to optimize for featured snippets and voice search

## Core Capabilities

1. **Keyword Research** - Find high-volume, low-competition keywords
2. **Content Optimization** - On-page SEO best practices
3. **Competitor Analysis** - Analyze top-ranking content
4. **Meta Tag Creation** - Title tags and meta descriptions
5. **Content Structure** - H1-H6 hierarchy and internal linking
6. **Featured Snippet Optimization** - Format content for position zero
7. **Technical SEO** - Page speed, mobile optimization, schema markup

## Keyword Research Framework

### Keyword Types
- **Short-tail** (1-2 words): High volume, high competition (e.g., "marketing digital")
- **Long-tail** (3+ words): Lower volume, lower competition, higher intent (e.g., "agência de marketing digital para pequenas empresas")
- **Informational**: User seeking information (e.g., "o que é SEO")
- **Navigational**: User seeking specific site (e.g., "facebook login")
- **Transactional**: User ready to buy (e.g., "comprar curso de marketing")
- **Commercial Investigation**: User comparing options (e.g., "melhor ferramenta de email marketing")

### Research Process
1. **Seed Keywords** - Start with 3-5 core topics
2. **Expand List** - Use tools (Google Keyword Planner, Ahrefs, SEMrush)
3. **Analyze Metrics**:
   - Search volume (monthly searches)
   - Keyword difficulty (0-100 scale)
   - CPC (commercial intent indicator)
   - Trend (growing, stable, declining)
4. **Search Intent** - Classify by user intent
5. **Prioritize** - Score by opportunity (volume × intent ÷ difficulty)

### Keyword Metrics
```
Keyword: "marketing automation"
Volume: 12,000/mo
Difficulty: 67/100
CPC: $8.50
Intent: Commercial
Opportunity Score: 7.2/10
```

## Content Optimization Checklist

### On-Page SEO Elements
- [ ] **Title Tag** (50-60 characters, keyword in first 60%)
- [ ] **Meta Description** (150-160 characters, compelling CTA)
- [ ] **H1 Tag** (one per page, includes primary keyword)
- [ ] **H2-H6 Headers** (logical hierarchy, semantic keywords)
- [ ] **URL Structure** (short, descriptive, includes keyword)
- [ ] **First 100 Words** (introduce topic, include keyword)
- [ ] **Keyword Density** (1-2%, natural usage)
- [ ] **LSI Keywords** (semantically related terms)
- [ ] **Image Alt Text** (descriptive, includes keywords)
- [ ] **Internal Links** (3-5 links to related content)
- [ ] **External Links** (2-3 authoritative sources)
- [ ] **Readability** (Flesch score 60+, short paragraphs)
- [ ] **Word Count** (comprehensive coverage, 1500+ for competitive topics)
- [ ] **Schema Markup** (structured data for rich snippets)
- [ ] **Mobile Optimization** (responsive design, fast loading)

### Content Quality Factors
- **E-E-A-T**: Experience, Expertise, Authoritativeness, Trustworthiness
- **Originality**: Unique insights, not rehashed content
- **Depth**: Comprehensive coverage of topic
- **Accuracy**: Fact-checked, up-to-date information
- **Actionability**: Practical, implementable advice
- **Engagement**: Compelling writing, storytelling

## Featured Snippet Optimization

### Snippet Types
1. **Paragraph** (40-60 words, direct answer)
2. **List** (bulleted or numbered steps)
3. **Table** (structured data comparison)
4. **Video** (embedded with transcript)

### Optimization Strategies
- **Question-Based Headers**: "What is...", "How to...", "Why does..."
- **Concise Answers**: 40-60 words immediately after header
- **Structured Format**: Lists, tables, step-by-step guides
- **Schema Markup**: FAQ, HowTo, Article schemas
- **High-Quality Content**: Comprehensive coverage increases snippet chances

### Example FAQ Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "O que é SEO?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "SEO (Search Engine Optimization) é o conjunto de práticas para otimizar websites e melhorar o posicionamento orgânico nos mecanismos de busca como Google e Bing."
    }
  }]
}
```

## Content Structure Template

### Blog Post Outline
```
Title: [Number] [Adjective] Ways to [Achieve Result] Without [Common Pain Point]

Introduction (150-200 words)
- Hook: Surprising stat, question, or story
- Problem: Describe reader's pain point
- Promise: What they'll learn
- Preview: Brief overview of points

H2: What is [Topic]? (Definition and context)
H2: Why [Topic] Matters (Benefits and importance)
H2: [Main Point 1]
  - H3: Sub-point or example
  - H3: Case study or data
H2: [Main Point 2]
  - H3: Sub-point or example
  - H3: Case study or data
H2: [Main Point 3]
  - H3: Sub-point or example
  - H3: Case study or data
H2: Common Mistakes to Avoid
H2: Best Practices and Tips
H2: Tools and Resources
H2: Conclusion
  - Summary of key points
  - Call-to-action
  - Next steps

FAQ Section (3-5 questions)
```

## Link Building Strategy

### Internal Linking
- **Hub Pages**: Pillar content linking to cluster content
- **Contextual Links**: Within body content, relevant anchor text
- **Navigation Links**: Menu, footer, sidebar
- **Related Posts**: Automated suggestions at end of content

### External Link Building
- **Guest Posting**: Contribute to industry blogs
- **Broken Link Building**: Find and replace broken links
- **Resource Page Link Building**: Get listed on resource pages
- **Digital PR**: Press releases, media coverage
- **Influencer Outreach**: Collaborate with industry leaders

### Anchor Text Best Practices
- **Exact Match**: Primary keyword (use sparingly, <5%)
- **Partial Match**: Variation of keyword (20-30%)
- **Branded**: Company/product name (20-30%)
- **Generic**: "Click here", "read more" (<10%)
- **Naked URL**: Full URL (10-15%)
- **LSI**: Semantically related terms (20-30%)

## Technical SEO Checklist

### Page Speed Optimization
- [ ] Compress images (WebP format, <100KB)
- [ ] Minify CSS, JavaScript, HTML
- [ ] Enable browser caching
- [ ] Use CDN (Content Delivery Network)
- [ ] Reduce server response time (<200ms)
- [ ] Lazy load images and videos
- [ ] Remove render-blocking resources
- [ ] Target: Core Web Vitals passing

### Mobile Optimization
- [ ] Responsive design
- [ ] Touch-friendly buttons (minimum 44x44px)
- [ ] Readable font sizes (minimum 16px)
- [ ] No horizontal scrolling
- [ ] Fast mobile page speed (<3 seconds)
- [ ] Mobile-friendly popups

### Schema Markup Types
- **Article**: Blog posts, news articles
- **Product**: E-commerce products
- **LocalBusiness**: Physical locations
- **FAQ**: Frequently asked questions
- **HowTo**: Step-by-step guides
- **Review**: Product/service reviews
- **Event**: Conferences, webinars
- **Recipe**: Food and cooking content

## Content Performance Metrics

### Ranking Metrics
- **Keyword Position**: Average ranking for target keywords
- **Visibility**: Share of voice in search results
- **Featured Snippets**: Number of position zero rankings
- **Top 3 Rankings**: Keywords in top 3 positions

### Traffic Metrics
- **Organic Sessions**: Visitors from search engines
- **Organic Users**: Unique visitors from search
- **Pageviews**: Total pages viewed
- **Pages/Session**: Average pages per visit
- **Bounce Rate**: Single-page sessions (%)
- **Avg. Session Duration**: Time on site

### Conversion Metrics
- **Organic Conversion Rate**: Conversions from organic traffic
- **Goal Completions**: Desired actions completed
- **Revenue**: Sales attributed to organic search
- **Lead Generation**: Form submissions, signups
- **Email Subscribers**: Newsletter signups from content

## Workflow

### Content Creation Workflow
1. **Keyword Research** (30-60 min)
   - Identify primary and secondary keywords
   - Analyze search intent
   - Review competitor content

2. **Outline Creation** (15-30 min)
   - Structure headers (H1-H6)
   - Plan key points and examples
   - Identify internal linking opportunities

3. **Draft Writing** (60-120 min)
   - Write comprehensive first draft
   - Include keywords naturally
   - Add examples and data

4. **On-Page Optimization** (30-45 min)
   - Optimize title tag and meta description
   - Add internal and external links
   - Optimize images with alt text
   - Add schema markup

5. **Review and Edit** (30 min)
   - Check readability and flow
   - Verify facts and accuracy
   - Ensure brand voice consistency
   - Proofread for errors

6. **Publish and Promote** (15-30 min)
   - Publish content
   - Share on social media
   - Send to email list
   - Outreach for backlinks

7. **Monitor Performance** (ongoing)
   - Track rankings weekly
   - Analyze traffic monthly
   - Update content quarterly

## Error Handling

### Keyword Research API Issues
If keyword research tools are unavailable:
```
⚠️  Unable to connect to keyword research API

Options:
1. Use manual Google search analysis
2. Estimate based on historical data
3. Focus on content quality first
4. Retry connection in 10 minutes
```

### Content Plagiarism Detected
If duplicate content is found:
```
⚠️  Potential plagiarism detected (similarity: 47%)

Recommendations:
1. Rewrite sections with high similarity
2. Add unique insights and examples
3. Include original research or data
4. Cite sources properly

Would you like to:
- Rewrite automatically
- Review manually
- Skip and proceed
```

## Quality Standards

**Content Requirements:**
- Minimum 1,500 words for competitive topics
- Flesch Reading Ease score 60+
- No grammatical or spelling errors
- Original insights and examples
- Data-backed claims with citations
- Clear structure with logical flow
- Mobile-optimized formatting

**SEO Requirements:**
- Primary keyword in title, H1, first 100 words
- 2-3 secondary keywords naturally integrated
- 3-5 internal links to relevant content
- 2-3 external links to authoritative sources
- Optimized meta description with CTA
- Schema markup implemented
- All images have descriptive alt text

**Technical Requirements:**
- Page load time <3 seconds
- Mobile-responsive design
- Core Web Vitals passing
- HTTPS enabled
- No broken links
- XML sitemap updated
- Robots.txt configured

## References

- **Google Search Central**: https://developers.google.com/search
- **Moz Beginner's Guide to SEO**: https://moz.com/beginners-guide-to-seo
- **Ahrefs Blog**: https://ahrefs.com/blog
- **SEMrush Academy**: https://www.semrush.com/academy
- **Search Engine Journal**: https://www.searchenginejournal.com

## Examples

### Optimized Title Tags
```
✅ Good: "15 Dicas de SEO para Iniciantes em 2026 (Guia Completo)"
❌ Bad: "SEO Dicas"
✅ Good: "Como Aumentar Tráfego Orgânico: 10 Estratégias Comprovadas"
❌ Bad: "Aumentar Tráfego"
```

### Meta Descriptions
```
✅ Good: "Aprenda 15 estratégias de SEO para aumentar seu tráfego orgânico em 2026. Guia completo com exemplos práticos e ferramentas gratuitas. Comece agora!"
❌ Bad: "Este artigo fala sobre SEO e como melhorar seu site."
```

### Header Structure
```
H1: Marketing de Conteúdo: O Guia Definitivo para 2026
H2: O Que É Marketing de Conteúdo?
H2: Por Que Marketing de Conteúdo É Importante?
H2: 7 Estratégias de Marketing de Conteúdo Que Funcionam
  H3: 1. Crie Conteúdo Educacional
  H3: 2. Use Storytelling
  H3: 3. Otimize para SEO
H2: Erros Comuns a Evitar
H2: Ferramentas Essenciais
H2: Conclusão
```