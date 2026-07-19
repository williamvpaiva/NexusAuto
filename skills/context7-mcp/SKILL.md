---
name: context7-mcp
description: "Use Context7 MCP server tools for documentation lookup when you have MCP access"
---

# Context7 MCP - Documentation Lookup via MCP

## When to Use
- Same as context7-cli but via MCP protocol
- You have access to Context7 MCP server
- Need programmatic doc lookup
- Building applications that need doc lookups

## Tools Available
1. `resolve-library-id` - Find library ID by name + query
2. `query-docs` - Fetch documentation for library ID + question

## Workflow
1. Call `resolve-library-id` with library name
2. Select best match from results (consider name, stars, benchmark score)
3. Call `query-docs` with library ID + question
4. Use documentation to answer

## Portuguese Triggers
- "buscar documentação do [biblioteca]"
- "consultar docs de [framework]"
- "procurar API do [serviço]"

## Example
```javascript
// Step 1: Resolve library
const libResult = await use_mcp_tool("context7_mcp", "resolve-library-id", {
  library_name: "react",
  query: "useEffect hook"
});
// Returns: { id: "react", name: "React", stars: 226k, ... }

// Step 2: Query docs
const docsResult = await use_mcp_tool("context7_mcp", "query-docs", {
  library_id: "react",
  question: "How to use useEffect with dependency array?"
});
// Returns: markdown documentation with code examples
```

## Related Skills
- context7-cli: CLI version (no MCP required)
- find-docs: Alternative CLI wrapper

## Notes
- MCP server must be running
- Requires Node.js 18+
- Free tier: 100 lookups/day