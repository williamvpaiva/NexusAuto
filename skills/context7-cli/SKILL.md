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
- User asks in Portuguese: "documentação do React", "como usar useEffect", "exemplo de API"

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

## Portuguese Triggers
- "documentação do [biblioteca]"
- "como usar [biblioteca]"
- "exemplo de [API/função]"
- "docs do [framework]"
- "manual do [ferramenta]"

## Example Workflow
1. User: "Como usar React hooks useEffect?"
2. Agent: `npx ctx7@latest library react "useEffect hook"`
3. Agent: `npx ctx7@latest docs [library-id] "useEffect hook dependency array"`
4. Provide fetched documentation with working example

## CLI Installation
```bash
npm install -g ctx7
# or
npx ctx7@latest [command]
```

## Environment
Requires: Node.js 18+
API Key (optional): CONTEXT7_API_KEY

## Supported Libraries
React, Next.js, Vue, Svelte, Angular, Nuxt, Remix, Astro, Prisma, Supabase, Tailwind, TypeScript, Django, FastAPI, Flask, Express, Fastify, NestJS, Axios, Fetch, React Query, Zustand, Redux, NextAuth, Clerk, Stripe, and 1000+ more

## Related Skills
- find-docs: Alternative CLI wrapper
- context7-mcp: MCP server version