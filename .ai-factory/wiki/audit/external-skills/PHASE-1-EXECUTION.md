# PHASE 1 EXECUTION - Critical Gaps (Week 1)

## Task 1: Integrate CONTEXT7 (upstash/context7)
**Estimated Time:** 2 hours  
**Priority:** CRITICAL  
**Compatibility:** 9.2/10

### Why This Skill?
- Zero overlap with existing NexusAuto skills
- Fills critical gap: up-to-date library documentation for LLMs
- 59.4k stars, production-proven
- CLI + MCP dual mode works with any agent

### Files to Create:
```
skills/context7-cli/SKILL.md
skills/context7-mcp/SKILL.md
skills/find-docs/SKILL.md
```

### Step-by-Step:

#### Step 1: Create skills/context7-cli/SKILL.md
```markdown
---
name: context7-cli
description: "Use when user asks about library documentation, API examples, or needs current docs for any framework/library (React, Next.js, Prisma, Supabase, etc.)"
---

# Context7 CLI - Documentation Lookup

## When to Use
- User asks "how to use [library]"
- User asks "docs for [framework]" 
- User asks "example of [API]"
- User needs up-to-date library documentation

## How to Use

### Step 1: Resolve Library ID
```bash
npx ctx7@latest library [library-name] "[query]"
```
Example: `npx ctx7@latest library nextjs "App Router server components"`

### Step 2: Query Documentation
```bash
npx ctx7@latest docs [library-id] "[specific-question]"
```

### Example Workflow
1. User: "Como usar React hooks useEffect?"
2. Agent: `npx ctx7@latest library react "useEffect hook"`
3. Agent: `npx ctx7@latest docs [library-id] "useEffect hook dependency array"`
4. Provide fetched documentation

## CLI Installation
```bash
npm install -g ctx7
# or
npx ctx7@latest [command]
```

## Environment
Requires: Node.js 18+
API Key (optional): CONTEXT7_API_KEY

## Related Skills
- find-docs: Alternative CLI wrapper
- context7-mcp: MCP server version
```

#### Step 2: Create skills/context7-mcp/SKILL.md
```markdown
---
name: context7-mcp
description: "Use Context7 MCP server tools for documentation lookup when you have MCP access"
---

# Context7 MCP - Documentation Lookup via MCP

## When to Use
- Same as context7-cli but via MCP protocol
- You have access to Context7 MCP server
- Need programmatic doc lookup

## Tools Available
1. `resolve-library-id` - Find library ID by name + query
2. `query-docs` - Fetch documentation for library ID

## Workflow
1. Call `resolve-library-id` with library name
2. Select best match from results (consider name, benchmark score)
3. Call `query-docs` with library ID + question
4. Use documentation to answer

## Related Skills
- context7-cli: CLI version (no MCP required)
- find-docs: Alternative CLI wrapper
```

#### Step 3: Create skills/find-docs/SKILL.md
```markdown
---
name: find-docs
description: "Use when you need to find documentation for any developer technology - library, framework, SDK, CLI, or cloud service"
---

# Find Docs - Documentation Lookup

## When to Use
- User asks about specific library/framework
- Need current documentation for implementation
- "Como faço X com [library]?"

## Two-Step Process

### Step 1: Resolve Library
```bash
npx ctx7@latest library [name] "[query]"
```

### Step 2: Query Docs  
```bash
npx ctx7@latest docs [library-id] "[question]"
```

## Example
User: "Exemplo de uso do Prisma com Next.js"
1. `npx ctx7@latest library prisma "Next.js integration"`
2. `npx ctx7@latest docs [id] "Next.js app directory usage"`
3. Provide working example

## Notes
- Works offline after initial install
- Version-specific documentation
- Covers 1000+ libraries

## Related Skills
- context7-cli: Direct CLI access
- context7-mcp: MCP server version
```

### Step 4: Add to wiki/index.md
Add under "Developer Skills" section:
```markdown
### Documentation
- [context7-cli](audit/external-skills/context7) - CLI doc lookup
- [context7-mcp](audit/external-skills/context7) - MCP doc lookup  
- [find-docs](audit/external-skills/context7) - CLI wrapper
```

### Step 5: Validation Test
```bash
# Test 1: Trigger recognition
# Say: "documentação do React hooks"
# Expected: context7-cli activates

# Test 2: Execution
# Run: npx ctx7@latest library react "useEffect"
# Expected: Returns library ID + info

# Test 3: Full flow
# Ask: "como usar useEffect com dependências?"
# Expected: Fetch docs, provide working example
```

---

## Task 2: Integrate UI-UX-PRO-MAX (nextlevelbuilder/ui-ux-pro-max-skill)
**Estimated Time:** 4 hours  
**Priority:** CRITICAL  
**Compatibility:** 8/10

### Why This Skill?
- 108k stars, massive design database
- 84 UI styles, 192 color palettes, 161 reasoning rules
- BM25 search engine for matching queries
- Data-driven design decisions

### Files to Create:
```
skills/ui-ux-pro-max/SKILL.md
skills/ui-ux-pro-max/data/ (14 CSV files)
skills/ui-ux-pro-max/src/ (search.py BM25 engine)
skills/design-system/SKILL.md
skills/ui-styling/SKILL.md
```

### Step-by-Step:

Due to size, download from source:
```bash
# Clone to temp location
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill /tmp/ui-ux-pro-max

# Copy structure
cp -r /tmp/ui-ux-pro-max/.claude/skills/ui-ux-pro-max skills/
cp -r /tmp/ui-ux-pro-max/src/ui-ux-pro-max/data skills/ui-ux-pro-max/
cp -r /tmp/ui-ux-pro-max/src/ui-ux-pro-max/search.py skills/ui-ux-pro-max/

# Adapt for NexusAuto
# - Change paths to relative
# - Add Portuguese triggers
# - Integrate with theme-factory
```

### Triggers to Add (Portuguese):
- "design system para SaaS"
- "cores para landing page"
- "tipografia para fintech"
- "estilo glassmorphism"
- "paleta neo-brutalism"

---

## Task 3: Integrate TRANSITIONS-DEV (Jakubantalik/transitions.dev)
**Estimated Time:** 2 hours  
**Priority:** CRITICAL  
**Compatibility:** 8/10

### Why This Skill?
- 27 production-ready CSS transitions
- Pure CSS, no dependencies
- Accessibility-first (prefers-reduced-motion)
- Motion token system for consistency

### Files to Create:
```
skills/transitions-dev/SKILL.md
skills/transitions-dev/_root.css
skills/transitions-dev/01-card-resize.md ... 27-toggle.md
skills/transitions-polish/SKILL.md
```

### Step-by-Step:
```bash
# Clone
git clone https://github.com/Jakubantalik/transitions.dev /tmp/transitions

# Copy
cp /tmp/transitions/skills/transitions-dev skills/
cp /tmp/transitions/skills/transitions-polish skills/

# Copy CSS root with motion tokens
cp /tmp/transitions/skills/transitions-dev/_root.css skills/transitions-dev/
```

### Add to frontend-design:
In "Leverage Motion Deliberately" section, add reference:
```markdown
## CSS Transitions
For specific CSS transitions, use `transitions-dev` skill:
- 27 production-ready transitions
- Pure CSS, no dependencies
- Accessible (prefers-reduced-motion)

Trigger: "transição do modal", "animação dropdown", "hover effect"
```

### Triggers (Portuguese):
- "transição do modal"
- "animação do dropdown"
- "hover effect card"
- "toast notification animation"

---

## Task 4: Create SEO-AUDIT Skill
**Estimated Time:** 1 hour  
**Priority:** HIGH  
**Source:** marketingskills/seo-audit

### Files to Create:
```
skills/seo-audit/SKILL.md
```

### Content:
Copy from https://github.com/coreyhaines31/marketingskills/tree/main/skills/seo-audit

### Triggers (Portuguese):
- "auditar SEO"
- "otimizar para busca"
- "Core Web Vitals"
- "meta tags"
- "schema markup"

---

## Task 5: Create ANALYTICS Skill
**Estimated Time:** 1 hour  
**Priority:** HIGH  
**Source:** marketingskills/analytics

### Files to Create:
```
skills/analytics/SKILL.md
```

### Content:
Copy from https://github.com/coreyhaines31/marketingskills/tree/main/skills/analytics

### Triggers (Portuguese):
- "setup GA4"
- "tracking events"
- "Google Analytics"
- "configurar analytics"

---

## PHASE 1 COMPLETION CHECKLIST

- [ ] context7-cli SKILL.md created
- [ ] context7-mcp SKILL.md created
- [ ] find-docs SKILL.md created
- [ ] ui-ux-pro-max downloaded and installed
- [ ] design-system wrapper created
- [ ] ui-styling created
- [ ] transitions-dev installed with _root.css
- [ ] transitions-polish created
- [ ] seo-audit created
- [ ] analytics created
- [ ] All skills added to wiki/index.md
- [ ] All skills logged in session/log.md
- [ ] hot.md updated

---

**Total Phase 1 Time:** ~10 hours  
**Next:** Phase 2 - Enhance Existing Skills