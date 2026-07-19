---
name: find-docs
description: "Use when you need to find documentation for any developer technology - library, framework, SDK, CLI, or cloud service"
---

# Find Docs - Documentation Lookup

## When to Use
- User asks about specific library/framework
- Need current documentation for implementation
- "Como faço X com [library]?"
- Building features that require library integration

## Two-Step Process

### Step 1: Resolve Library
```bash
npx ctx7@latest library [name] "[query]"
```

### Step 2: Query Docs
```bash
npx ctx7@latest docs [library-id] "[question]"
```

## Portuguese Triggers
- "documentação do [X]"
- "como usar [X]"
- "exemplo de [X] com [Y]"
- "manual de [ferramenta]"
- "API do [serviço]"
- "docs atualizadas do [framework]"

## Example Workflows

### Example 1: React Hook
User: "Exemplo de uso do Prisma com Next.js"
1. `npx ctx7@latest library prisma "Next.js integration"`
2. `npx ctx7@latest docs [id] "Next.js app directory usage"`
3. Provide working example with code

### Example 2: API Documentation
User: "Documentação do Stripe para payments"
1. `npx ctx7@latest library stripe "Node.js payment intent"`
2. `npx ctx7@latest docs [id] "create payment intent"
3. Provide documentation with examples

### Example 3: Framework Feature
User: "Como implementar autenticação no Next.js?"
1. `npx ctx7@latest library nextjs "authentication"
2. `npx ctx7@latest docs [id] "auth setup with NextAuth"
3. Provide step-by-step guide

## Supported Technologies
- **Frontend**: React, Vue, Angular, Svelte, Next.js, Nuxt, Remix, Astro
- **Backend**: Node.js, Python, Go, Rust, Java, Ruby, PHP
- **Databases**: PostgreSQL, MySQL, MongoDB, Prisma, Drizzle, SQLAlchemy
- **Cloud**: AWS, Azure, GCP, Vercel, Netlify, Cloudflare
- **APIs**: REST, GraphQL, gRPC, tRPC, WebSocket
- **Auth**: NextAuth, Clerk, Auth0, Firebase, Supabase Auth
- **Payments**: Stripe, PayPal, Square
- **And 1000+ more**

## Notes
- Works offline after initial install
- Version-specific documentation
- Always returns latest stable docs
- BM25 search for relevance

## Related Skills
- context7-cli: Direct CLI access
- context7-mcp: MCP server version