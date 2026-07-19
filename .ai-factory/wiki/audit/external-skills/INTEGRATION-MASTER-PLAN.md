# NEXUSAUTO EXTERNAL SKILLS INTEGRATION MASTER PLAN

**Date:** 2026-07-19  
**Auditor:** Paranoid Ecosystem Analyzer  
**Scope:** 9 External Repositories Analysis → NexusAuto Integration  
**Status:** PLANNING PHASE

---

## 1. EXECUTIVE SUMMARY

### Repositories Analyzed (9 total)

| Category | Repo | Stars | Skills | Compatibility |
|----------|------|-------|--------|----------------|
| **Developers** | obra/superpowers | 257k | 14 | 7/10 |
| **Developers** | upstash/context7 | 59.4k | 3 | **9.2/10** |
| **Developers** | anthropics/skills | ?? | 17 | 7.6/10 |
| **Developers** | thedotmack/claude-mem | 87.8k | 18 | 4/10 |
| **Designers** | nextlevelbuilder/ui-ux-pro-max-skill | 108k | 7 | **8/10** |
| **Designers** | Leonxlnx/taste-skill | 65.2k | 13 | 7/10 |
| **Designers** | Jakubantalik/transitions.dev | 2.2k | 2 | **8/10** |
| **Marketing** | coreyhaines31/marketingskills | 40.7k | 45 | 6/10 |
| **Social Media** | charlie947/social-media-skills | 1.9k | 17 | 6/10 |

### Integration Priority Matrix

```
HIGH VALUE + NO OVERLAP = INTEGRATE IMMEDIATELY
HIGH VALUE + OVERLAP = MERGE/HYBRIDIZE
LOW VALUE + OVERLAP = REJECT/DUPLICATE
LOW VALUE + NO OVERLAP = EVALUATE LATER
```

---

## 2. CURRENT NEXUSAUTO SKILLS (14)

| # | Skill | Purpose | Duplicates? |
|---|-------|---------|-------------|
| 1 | `web-artifacts-builder` | HTML/CSS/JS artifacts | No |
| 2 | `theme-factory` | Design theming | Partial |
| 3 | `testing-qa` | QA/testing | Partial |
| 4 | `tavily-web` | Web search | No |
| 5 | `doc-coauthoring` | Document writing | Yes (anthropic) |
| 6 | `hyperframes` | Animation/frames | No |
| 7 | `product-launch-manager` | Launch strategy | Partial (marketing) |
| 8 | `code-reviewer` | Code review | Partial |
| 9 | `lider` | Leadership | No |
| 10 | `frontend-design` | Frontend design | Partial |
| 11 | `digital-product-creator` | Product creation | No |
| 12 | `monetization-strategist` | Revenue strategy | No |
| 13 | `brand-guidelines` | Brand guidelines | Yes (anthropic) |
| 14 | `debugger` | Debugging | Partial |

---

## 3. EXTERNAL SKILLS → INTEGRATION TASKS

### PRIORITY 1: HIGH VALUE + NO OVERLAP (Integrate Now)

#### 3.1 CONTEXT7 (upstash/context7) — Documentation Lookup
**Score:** 9.2/10  
**Why:** Zero overlap with NexusAuto, fills critical gap for up-to-date library docs

**Files to Create:**
```
skills/context7-cli/SKILL.md
skills/context7-mcp/SKILL.md
skills/find-docs/SKILL.md
```

**Integration Steps:**
1. Create `skills/context7-cli/SKILL.md` from repo `skills/context7-cli/`
2. Create `skills/context7-mcp/SKILL.md` from repo `skills/context7-mcp/`
3. Create `skills/find-docs/SKILL.md` from repo `skills/find-docs/`
4. Add context7 setup instructions to wiki
5. Create validation test: ask about React hooks, verify doc retrieval

**Triggers to Add:**
- "documentação do React", "docs do Next.js", "API do Stripe", "biblioteca X documentation"
- "como usar [library]", "exemplo de [framework]"

---

#### 3.2 UI-UX-PRO-MAX (nextlevelbuilder/ui-ux-pro-max-skill) — Design System Data
**Score:** 8/10  
**Why:** Massive CSV database (84 styles, 192 palettes, 161 reasoning rules) - data-driven vs principle-driven

**Files to Create:**
```
skills/ui-ux-pro-max/SKILL.md
skills/ui-ux-pro-max/data/ (all 14 CSV files)
skills/ui-ux-pro-max/src/ (search.py, BM25 engine)
skills/design-system/SKILL.md
skills/ui-styling/SKILL.md
```

**Integration Steps:**
1. Copy entire `.claude/skills/ui-ux-pro-max/` structure
2. Copy `src/ui-ux-pro-max/data/` CSV files
3. Copy `src/ui-ux-pro-max/search.py` (BM25 engine)
4. Create wrapper skill `design-system` that integrates with theme-factory
5. Create `ui-styling` skill for CSS per framework
6. Add to frontend-design as DATA SOURCE reference
7. Validation: query "e-commerce dashboard" → verify style/palette/typography returned

**Triggers:**
- "design system para SaaS", "cores para landing page", "tipografia para fintech"
- "estilo glassmorphism", "paleta neo-brutalism", "font pairing para app"

---

#### 3.3 TRANSITIONS-DEV (Jakubantalik/transitions.dev) — CSS Transitions
**Score:** 8/10  
**Why:** 27 production-ready CSS transitions, pure CSS, no dependencies

**Files to Create:**
```
skills/transitions-dev/SKILL.md
skills/transitions-dev/_root.css
skills/transitions-dev/01-card-resize.md ... 27-toggle.md
skills/transitions-polish/SKILL.md
```

**Integration Steps:**
1. Copy `skills/transitions-dev/` with all 27 transition refs
2. Copy `_root.css` with motion tokens
3. Create `skills/transitions-polish/SKILL.md`
4. Integrate with frontend-design (motion section)
5. Add CLI tool reference: `transitions reveal/apply/refine`
6. Validation: ask "modal transition" → get CSS + HTML hooks

**Triggers:**
- "transição do modal", "animação do dropdown", "hover effect"
- "card expand animation", "toast notification", "slider tab"

---

#### 3.4 SEO-AUDIT + ANALYTICS (marketingskills) — SEO & Analytics
**Score:** 6/10 → **8/10 for NexusAuto**  
**Why:** NexusAuto lacks SEO/analytics skills entirely

**Files to Create:**
```
skills/seo-audit/SKILL.md
skills/analytics/SKILL.md
skills/ab-testing/SKILL.md
```

**Integration Steps:**
1. Copy `seo-audit` skill from marketingskills
2. Copy `analytics` skill (GA4 tracking setup)
3. Copy `ab-testing` skill (experimentation methodology)
4. Create nexusauto-seo wrapper with Brazilian market focus
5. Validation: audit current website → list SEO issues found

**Triggers:**
- "auditar SEO", "Google Analytics setup", "A/B test design"
- "meta tags优化", "Core Web Vitals", "schema markup"

---

### PRIORITY 2: HIGH VALUE + MERGE REQUIRED

#### 3.5 SYSTEMATIC-Debugging + TDD (superpowers)
**Score:** 7/10  
**Why:** Overlaps with debugger + testing-qa but MORE RIGOROUS

**Current State:**
- NexusAuto `debugger`: Generic debugging guidance
- NexusAuto `testing-qa`: Bundle of testing references
- Superpowers `systematic-debugging`: 4-phase root cause, Iron Law
- Superpowers `test-driven-development`: RED-GREEN-REFACTOR strict

**Action:** HYBRIDIZE - Keep NexusAuto wrappers, import superpowers methodology

**Files to Create/Modify:**
```
skills/debugger/SKILL.md (ENHANCE with systematic-debugging)
skills/testing-qa/SKILL.md (ENHANCE with TDD)
```

**Integration Steps:**
1. Read superpowers `systematic-debugging` SKILL.md
2. Read superpowers `test-driven-development` SKILL.md
3. Extract Iron Law patterns, 4-phase process, verification commands
4. Inject into NexusAuto debugger SKILL.md as "Methodology" section
5. Inject RED-GREEN-REFACTOR strict cycle into testing-qa
6. Keep NexusAuto language/Portuguese focus
7. Add: "Antes de propor fixes, investigar raiz - 4 fases"

**Triggers (add to existing skills):**
- "root cause", "por que está falhando", "TDD", "test-driven"

---

#### 3.6 SUBAGENT-DRIVEN-DEVELOPMENT (superpowers)
**Score:** 7/10  
**Why:** Unique workflow pattern not in NexusAuto

**Files to Create:**
```
skills/subagent-driven-development/SKILL.md
```

**Integration Steps:**
1. Copy from superpowers `subagent-driven-development`
2. Adapt to NexusAuto context (Portuguese prompts)
3. Document in wiki as "Execution Pattern"
4. Link from writing-plans → subagent-driven-development
5. Validation: execute multi-task plan via subagents

---

#### 3.7 FRONTEND-DESIGN ENHANCEMENT (taste-skill)
**Score:** 7/10  
**Why:** taste-skill has 3-dials system + anti-AI-slop rules

**Action:** MERGE taste-skill principles INTO frontend-design

**Files to Modify:**
```
skills/frontend-design/SKILL.md (EXPAND)
```

**Integration Steps:**
1. Read taste-skill `taste-skill/SKILL.md`
2. Extract 3-dials mechanism (VARIANCE/MOTION/DENSITY)
3. Extract "AI tells" (forbidden patterns)
4. Extract GSAP/Motion skeletons
5. Add as NEW SECTIONS in frontend-design:
   - Design Dials (1-10 scale)
   - Anti-Slop Rules (explicit forbidden patterns)
   - Motion Skeletons (GSAP examples)
6. Keep Portuguese language, Nexus context

**Triggers (add):**
- "não genérico", "anti-padrão", "design distinctivo", "3 dial"

---

#### 3.8 WRITING-PLANS (superpowers)
**Score:** 7/10  
**Why:** Better structured than current ad-hoc planning

**Files to Create:**
```
skills/writing-plans/SKILL.md
```

**Integration Steps:**
1. Copy from superpowers `writing-plans`
2. Adapt to Portuguese
3. Link from brainstorm → writing-plans
4. Document "No placeholders" rule
5. Integration with subagent-driven-development

---

### PRIORITY 3: MEDIUM VALUE / REQUIRES ADAPTATION

#### 3.9 SOCIAL-MEDIA-SKILLS (charlie947)
**Score:** 6/10  
**Why:** Good frameworks but English-first, external API deps

**Action:** FORK AS NEW CATEGORY, adapt to BR market

**Files to Create:**
```
skills/social-media-marketing/voice-builder/SKILL.md
skills/social-media-marketing/post-writer/SKILL.md
skills/social-media-marketing/content-matrix/SKILL.md
skills/social-media-marketing/analytics-dashboard/SKILL.md
```

**Integration Steps:**
1. Fork entire `social-media-skills` repo locally
2. Create `skills/social-media-marketing/` category
3. Translate trigger phrases to Portuguese
4. Adapt voice-builder → Brazilian LinkedIn context
5. Extract content-matrix (8-format x content-pillars)
6. Note: Apify/Gemini deps - document as optional
7. Keep as REFERENCE implementation, not direct import

**Triggers:**
- "post para LinkedIn", "conteúdo para Instagram", "engajamento"

---

#### 3.10 SKILL-CREATOR (anthropic)
**Score:** 8/10  
**Why:** Would accelerate NexusAuto skill development

**Files to Create:**
```
skills/skill-creator/SKILL.md
```

**Integration Steps:**
1. Copy from anthropic `skill-creator`
2. Adapt to NexusAuto skill format
3. Add TDD for documentation (RED-GREEN-REFACTOR for docs)
4. Document in wiki: "How to create new NexusAuto skills"
5. Validation: create test skill following guide

---

#### 3.11 DOCUMENT SKILLS (anthropic) — PDF/DOCX/PPTX/XLSX
**Score:** 8/10  
**Why:** Missing from NexusAuto, high utility

**Files to Create:**
```
skills/pdf/SKILL.md
skills/docx/SKILL.md
skills/pptx/SKILL.md
skills/xlsx/SKILL.md
```

**Integration Steps:**
1. Copy from anthropic skills
2. Translate to Portuguese triggers
3. Add to relevant workflows:
   - pdf → doc-coauthoring output formats
   - docx → documentation exports
   - pptx → presentations (link with hyperframes?)
   - xlsx → analytics/reports
4. Validation: create PDF report, create Excel spreadsheet

---

### PRIORITY 4: LOW PRIORITY / EVALUATE LATER

#### 3.12 CLAUDE-MEM (thedotmack/claude-mem)
**Score:** 4/10  
**Why:** Requires memory infrastructure, different paradigm

**Action:** BORROW PATTERNS only, don't integrate

**Borrow From:**
- `smart-explore` (AST-based exploration) → enhance research skill
- `design-is` (Dieter Rams audit) → enhance frontend-design
- `oh-my-issues` (clustering/root-cause) → future backlog analysis

**Do NOT Import:**
- Memory-dependent skills (mem-search, knowledge-agent, timeline-report)
- Requires: Bun runtime, uv, Chroma vector DB, SQLite

---

#### 3.13 SUPERPOWERS REMAINING SKILLS
**Score:** 7/10  
**Why:** Some overlap, some unique

**Import as-is (no merge needed):**
- `dispatching-parallel-agents` → multi-agent orchestration
- `verification-before-completion` → quality enforcement
- `finishing-a-development-branch` → PR/merge workflow

**Do NOT Import (already covered):**
- `brainstorming` → NexusAuto has lider/product-launch
- `using-git-worktrees` → infrastructure concern
- `executing-plans` → similar to subagent-driven-development

---

#### 3.14 MARKETING REMAINING SKILLS
**Score:** 6/10  
**Why:** Good coverage but fragmented

**Selective Import:**
- `cold-email` → B2B outreach
- `ads` → Paid campaigns (Google, Meta, LinkedIn)
- `revops` → Revenue operations
- `churn-prevention` → Retention

**Do NOT Import (lower priority):**
- `sms` → Requires SMS gateway
- `video` → Already have hyperframes
- `directory-submissions` → Manual process

---

## 4. VALIDATION PROTOCOL

For each skill integration:

```
1. CLEAN IMPORT
   - Copy SKILL.md and references
   - Translate triggers to Portuguese
   - Adapt to NexusAuto context
   
2. VERIFY NO DUPLICATE
   - grep existing skills for same purpose
   - If duplicate: MERGE not REPLACE
   
3. TEST TRIGGERS
   - Ask triggering phrase in chat
   - Verify correct skill activates
   - Check output quality
   
4. INTEGRATION TEST
   - Chain with related skills
   - Verify context passes correctly
   - Check memory/continuity
   
5. DOCUMENT
   - Add to wiki/index.md
   - Update hot.md session
   - Log in session/log.md
```

---

## 5. TASK EXECUTION ORDER

### PHASE 1: CRITICAL GAPS (Week 1)
| # | Task | Skill Source | Hours |
|---|------|--------------|-------|
| 1 | Integrate context7 (cli + mcp + find-docs) | upstash/context7 | 2h |
| 2 | Integrate ui-ux-pro-max data + search | nextlevelbuilder | 4h |
| 3 | Integrate transitions-dev (27 CSS) | transitions.dev | 2h |
| 4 | Create seo-audit skill | marketingskills | 1h |
| 5 | Create analytics skill | marketingskills | 1h |

### PHASE 2: ENHANCE EXISTING (Week 2)
| # | Task | Source | Hours |
|---|------|--------|-------|
| 6 | Hybridize debugger + systematic-debugging | superpowers | 2h |
| 7 | Hybridize testing-qa + TDD | superpowers | 2h |
| 8 | Enhance frontend-design + taste-skill 3-dials | Leonxlnx | 3h |
| 9 | Create subagent-driven-development | superpowers | 1h |
| 10 | Create writing-plans | superpowers | 1h |

### PHASE 3: EXPAND CAPABILITIES (Week 3)
| # | Task | Source | Hours |
|---|------|--------|-------|
| 11 | Create social-media-marketing category | charlie947 | 4h |
| 12 | Create skill-creator | anthropic | 2h |
| 13 | Create PDF/DOCX/PPTX/XLSX skills | anthropic | 4h |
| 14 | Import dispatching-parallel-agents | superpowers | 1h |
| 15 | Import verification-before-completion | superpowers | 1h |

### PHASE 4: POLISH (Week 4)
| # | Task | Hours |
|---|------|-------|
| 16 | Update wiki/index.md with all new skills | 1h |
| 17 | Create cross-reference matrix (which skill triggers which) | 2h |
| 18 | Integration testing all chains | 4h |
| 19 | Documentation in AGENTS.md | 1h |
| 20 | Final audit - verify no duplicates | 2h |

---

## 6. CROSS-REFERENCE MATRIX

### Skill → Trigger Phrases (Portuguese)

| Skill | Triggers (PT-BR) |
|-------|-------------------|
| context7-cli | "docs do React", "documentação do Next", "API do Stripe" |
| context7-mcp | "como usar [biblioteca]", "exemplo de [framework]" |
| find-docs | "buscar documentação", "resolver dúvida de lib" |
| ui-ux-pro-max | "design system para X", "cores para Y", "tipografia para Z" |
| design-system | "gerar design system", "criar token de design" |
| ui-styling | "CSS para React", "estilização Vue", "Tailwind para X" |
| transitions-dev | "transição do modal", "animação dropdown", "hover effect" |
| transitions-polish | "polir timing", "tunar animação" |
| seo-audit | "auditar SEO", "otimizar busca", "Core Web Vitals" |
| analytics | "setup GA4", "tracking events", "Google Analytics" |
| ab-testing | "teste A/B", "experimento", "validação statistical" |
| systematic-debugging | "root cause", "por que está falhando", "4 fases" |
| TDD | "test-driven", "RED-GREEN", "TDD" |
| subagent-driven | "executar plano", "dispatch agents", "tarefas paralelas" |
| writing-plans | "criar plano", "planejar implementação" |
| frontend-design | (EXISTING - add 3-dials, anti-slop) |
| social-media-marketing | "post LinkedIn", "conteúdo Instagram", "engajamento" |
| skill-creator | "criar skill", "desenvolver nova habilidade" |
| pdf | "gerar PDF", "documento PDF" |
| docx | "documento Word", "criar .docx" |
| pptx | "apresentação", "slides PowerPoint" |
| xlsx | "planilha Excel", "criar .xlsx" |

### Skill → Dependency Chain

```
brainstorming → writing-plans → subagent-driven-development → requesting-code-review → verification-before-completion → finishing-a-development-branch

context7-cli/mcp → any skill needing library documentation

ui-ux-pro-max → frontend-design → transitions-dev

seo-audit → analytics → ab-testing

skill-creator → any NEW skill being created

social-media-marketing → voice-builder → post-writer/content-matrix
```

---

## 7. MEMORY INTEGRATION

### How External Skills Use NexusAuto Memory

NexusAuto Memory System:
- `.ai-factory/wiki/session/hot.md` - Session continuity
- `.ai-factory/wiki/session/log.md` - Append-only log
- `.ai-factory/brain/Memories.md` - Persistent context
- `.ai-factory/brain/Key\ Decisions.md` - Decision log

### For Each Integrated Skill:

1. **Entry Point:** Read hot.md for session context
2. **During Execution:** Log progress to session/log.md  
3. **On Completion:** Update hot.md, commit to brain/Memories.md
4. **Cross-Skill:** Use wiki links for context passing

### Example Integration:

```
SKILL: context7-cli

Trigger: "docs do React"

1. READ hot.md → get current project context
2. EXECUTE ctx7 library react query
3. USE result in conversation
4. LOG: "Used context7 for React docs" → session/log.md
5. UPDATE hot.md if new context learned
```

---

## 8. VALIDATION CHECKLIST

After each integration:

- [ ] Skill file exists at correct path
- [ ] Triggers tested in Portuguese
- [ ] No duplicate with existing skill (grep check)
- [ ] Links to related skills work
- [ ] Memory integration points followed
- [ ] Added to wiki/index.md
- [ ] Logged in session/log.md
- [ ] hot.md updated if session active

---

## 9. REJECTED SKILLS (Do Not Import)

| Skill | Reason |
|-------|--------|
| claude-mem full integration | Requires memory infrastructure not in NexusAuto |
| marketingskills cold-email | Lower priority, can add later |
| superpowers brainstorming | Already have lider + product-launch |
| social-media-skills full import | English-first, requires API keys |
| anthropic brand-guidelines | Already have NexusAuto-specific brand |
| anthropic theme-factory | Already have Nexus themes |

---

## 10. SIGN-OFF

**Prepared by:** Paranoid External Skills Analyzer  
**Date:** 2026-07-19  
**Next Step:** Execute Phase 1 tasks

**Approval Required:** None - this is an integration plan, not a code change

---