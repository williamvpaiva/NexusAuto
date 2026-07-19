---
name: seo-audit
description: "Use when user wants to audit, review, or diagnose SEO issues on their site. Also use when user mentions 'SEO audit', 'search engine optimization', 'Google ranking', 'search visibility', or 'organic traffic'"
---

# SEO Audit - Technical & On-Page SEO Analysis

## When to Use
- User wants to audit SEO issues
- User mentions "SEO audit", "search engine optimization"
- User asks about Google ranking or search visibility
- User wants to improve organic traffic
- Site migration or redesign planning

## Portuguese Triggers
- "auditar SEO"
- "otimizar para busca"
- "melhorar ranking Google"
- "SEO técnico"
- "Core Web Vitals"
- "meta tags"
- "schema markup"
- "sitemap.xml"
- "robots.txt"

## SEO Audit Framework

### 1. Technical SEO

#### Crawlability
- [ ] Check robots.txt (blocklist, allowlist)
- [ ] Check sitemap.xml (structure, updates)
- [ ] Check for crawl errors
- [ ] Verify canonical tags
- [ ] Check for orphan pages

#### Indexation
- [ ] site:domain.com search in Google
- [ ] Check index coverage in GSC
- [ ] Identify noindex pages that should be indexed
- [ ] Check paginated content (rel=next/prev)

#### Performance (Core Web Vitals)
| Metric | Target | Critical |
|--------|--------|----------|
| LCP | < 2.5s | > 4.0s |
| FID | < 100ms | > 300ms |
| CLS | < 0.1 | > 0.25 |
| INP | < 200ms | > 500ms |

### 2. On-Page SEO

#### Title Tags
- [ ] Length: 50-60 characters
- [ ] Unique per page
- [ ] Primary keyword near beginning
- [ ] Brand at end (if included)

#### Meta Descriptions
- [ ] Length: 150-160 characters
- [ ] Unique per page
- [ ] Call to action
- [ ] Primary keyword included

#### Headings (H1-H6)
- [ ] One H1 per page
- [ ] H1 contains primary keyword
- [ ] Logical heading hierarchy
- [ ] No skipped heading levels

#### Content
- [ ] Keyword density: 1-2%
- [ ] Content length: 300+ words (depends on query)
- [ ] Internal linking
- [ ] Image alt text
- [ ] External links to authoritative sources

### 3. Off-Page SEO

#### Backlinks
- [ ] Total backlink count
- [ ] Referring domains diversity
- [ ] Toxic/spam backlinks
- [ ] New vs lost links

#### Brand Signals
- [ ] Brand mentions (linked and unlinked)
- [ ] Local SEO signals (if applicable)
- [ ] Social signals

### 4. Mobile SEO
- [ ] Mobile-first indexing
- [ ] Responsive design
- [ ] Mobile page speed
- [ ] Touch-friendly elements

### 5. Schema & Structured Data
- [ ] Verify existing schema
- [ ] Add relevant schema types
- [ ] Test with Rich Results Test
- [ ] Check for schema errors

## Common SEO Issues & Fixes

### Issue: Pages not indexed
```markdown
1. Check robots.txt
2. Check meta robots noindex
3. Check canonical pointing to non-indexed page
4. Check XML sitemap
5. Verify with URL Inspection tool
```

### Issue: Thin content
```markdown
1. Expand content with valuable information
2. Add FAQ section
3. Include user intent analysis
4. Add supporting media (images, video)
```

### Issue: Slow Core Web Vitals
```markdown
LCP: Optimize images, use CDN, reduce server time
FID: Defer non-critical JS, optimize code
CLS: Set image dimensions, avoid dynamic content insertion
```

## SEO Audit Tools

| Tool | Purpose |
|------|---------|
| Google Search Console | Index coverage, performance |
| Google PageSpeed Insights | Core Web Vitals |
| Screaming Frog | Crawl analysis |
| Ahrefs | Backlinks, keywords |
| SEMrush | Competitor analysis |
| GTmetrix | Performance testing |

## Output Template

```markdown
# SEO Audit Report: [Site Name]

## Executive Summary
[High-level findings and recommendations]

## Technical SEO
### Issues Found
1. [Issue] - [Severity] - [Impact]
2. ...

### Recommendations
1. [Recommendation]
2. ...

## On-Page SEO
### Issues Found
1. [Issue] - [Severity] - [Impact]
2. ...

### Recommendations
1. [Recommendation]
2. ...

## Priority Actions
1. [Top 3 actionable items with expected impact]

## Related Skills
- schema: For structured data implementation
- site-architecture: For URL structure and navigation
- content-strategy: For content planning