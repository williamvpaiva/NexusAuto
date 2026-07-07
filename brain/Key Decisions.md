# Key Decisions

## Substituição da Evolution API pelo OpenWA
- **Data:** 2026-07-05
- **Contexto:** A Evolution API tem limitações na integração direta com os Agentes de IA do NexusAuto.
- **Decisão:** Migrar para o OpenWA como gateway de WhatsApp oficial.
- **Justificativa:** O OpenWA fornece suporte nativo a MCP Server (Model Context Protocol), que permite que os agentes do NexusAuto se conectem diretamente à API do WhatsApp e usem suas ferramentas (send_text, get_qr, create_session, etc.). O OpenWA é 100% open-source, possui interface via Swagger, suporta bancos de dados como PostgreSQL e SQLite, e possibilita uma integração não-invasiva no ambiente Docker Compose.

## Integração do UI/UX Pro Max como Camada de Design System
- **Data:** 2026-07-05
- **Contexto:** O NexusAuto precisava de uma camada automatizada de geração de especificações visuais para guiar agentes de frontend (frontend-dev, ui-designer) na construção de interfaces consistentes e acessíveis.
- **Decisão:** Integrar o UI/UX Pro Max como um agente especializado que gera design systems completos (layout, cores, tipografia, efeitos CSS, antipadrões, checklist) a partir de descrições textuais.
- **Justificativa:** 
  - **Não-invasivo:** O UI/UX Pro Max não substitui agentes existentes, apenas os alimenta com especificações técnicas precisas.
  - **Especificações vivas:** Gera arquivos `design-spec.md` versionados junto com `spec.md` do Spec-Kit.
  - **Qualidade garantida:** Checklist embutido valida acessibilidade (WCAG 2.1 AA), responsividade (mobile-first) e performance (Core Web Vitals).
  - **Flexível:** Funciona em modo mock se o módulo não estiver disponível, permitindo desenvolvimento contínuo.
- **Implementação:**
  - Submódulo git: `ui-ux-pro-max/`
  - Wrapper Python: `.ai-factory/scripts/ui-ux-pro-max-wrapper.py`
  - Bridge Node.js: `.ai-factory/scripts/ui-ux-pro-max-bridge.js`
  - Agente: `.ai-factory/agents/ui-ux-pro-max-agent.md`
  - Workflow: `.ai-factory/workflows/design-workflow.md`
  - Endpoint API: `POST /api/design/generate`, `POST /api/design/save`
  - Slash commands: `/design generate`, `/design save`, `/design palette`, `/design typography`, `/design checklist`, `/design status`
- **Impacto:**
  - Frontend-dev recebe especificações visuais claras antes de implementar
  - QA-tester valida contra checklist objetivo
  - Economia de tempo: design gerado em < 30 segundos vs. horas de discussão
  - Consistência visual em todo o projeto

## Testes: Auth Middleware Executa Antes do Validation Pipe
- **Data:** 2026-07-06
- **Contexto:** Teste de validação 422 em `error-handler.test.ts` estava recebendo 401 (Unauthorized) em vez de 422 (Validation Error).
- **Decisão:** Testes de validação (erro 422) devem fornecer JWT real + CSRF token registrado. Não usar `'test-token'` fake.
- **Justificativa:** O middleware de autenticação roda ANTES do validation pipe no Express. Se o token é inválido, o request nunca chega ao validation pipe. Tokens fake causam 401 prematuro.

## Testes: SuperTest em TypeScript Não Suporta Bracket Notation
- **Data:** 2026-07-06
- **Contexto:** `request(app)[method as 'get'](url)` retornava `undefined` em `memory.test.ts`.
- **Decisão:** Usar chamadas diretas: `request(app).get(url)`, `request(app).post(url)`, etc.
- **Justificativa:** O tipo `SuperTest<Test>` não expõe index signature. Bracket notation retorna `undefined` em runtime. Chamadas diretas são tipadas e funcionais.

## Testes: Códigos HttpStatus Devem Bater com o Service Layer
- **Data:** 2026-07-06
- **Contexto:** `users.test.ts` esperava `NOT_FOUND` mas o service lançava `USER_NOT_FOUND`.
- **Decisão:** O teste deve usar o código exato que o service lança.
- **Justificativa:** `HttpStatus.NOT_FOUND` (genérico) e `ServiceErrorCode.USER_NOT_FOUND` (específico) são valores diferentes. O teste precisa refletir o comportamento real, não o esperado idealizado.
