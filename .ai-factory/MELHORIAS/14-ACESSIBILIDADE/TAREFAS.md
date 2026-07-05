# 14 — ACESSIBILIDADE

> Acessibilidade web: WCAG, ARIA, navegação por teclado, contraste e screen readers
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Média
> **Dependências:** 07-UI-COMPONENTS (componentes base)

---

## 📋 Tarefas

### ACE-001 — Auditoria de Acessibilidade (axe-core)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Integrar axe-core nos testes de componente e auditoria manual de todas as páginas (Login, Home, Health) para detectar violações WCAG 2.2
- **Critério de aceite:** Relatório de auditoria lista violações por severidade; zero violações críticas/graves
- **Esforço:** 3h
- **Prioridade:** Alta

### ACE-002 — Atributos ARIA Essenciais
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar atributos ARIA a componentes-chave: roles, aria-label, aria-describedby, aria-live, aria-expanded, aria-controls
- **Critério de aceite:** Modal tem role="dialog" + aria-modal; erros de formulário têm aria-describedby; navegação tem aria-current
- **Esforço:** 3h
- **Prioridade:** Alta

### ACE-003 — Navegação por Teclado (Focus Management)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar focus trap em modais, Tab index lógico, indicador de foco visível (outline), skip-to-content link
- **Critério de aceite:** Tab navega em ordem lógica; ESC fecha modal; focus volta ao trigger ao fechar; skip link visível no primeiro Tab
- **Esforço:** 4h
- **Prioridade:** Alta

### ACE-004 — Contraste e Temas Acessíveis
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Verificar e ajustar contraste de cor para WCAG AA (4.5:1 texto normal, 3:1 texto grande), oferecer tema de alto contraste
- **Critério de aceite:** Todas as combinações cor/texto têm contraste ≥ 4.5:1; tema "High Contrast" disponível no toggle de tema
- **Esforço:** 3h
- **Prioridade:** Média

### ACE-005 — Semântica HTML e Landmarks
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Revisar estrutura HTML: tags semânticas (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`), landmarks e headings hierarchy (h1→h6)
- **Critério de aceite:** Páginas têm landmarks corretas; heading hierarchy sem saltos; screen reader navega corretamente
- **Esforço:** 2h
- **Prioridade:** Média

### ACE-006 — Textos Alternativos e Mídia
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Garantir alt text em todas as imagens, labels em ícones decorativos (aria-hidden), transcrição para áudio/vídeo
- **Critério de aceite:** Nenhuma imagem informativa sem alt text; ícones decorativos com aria-hidden; tooltips para ícones sem label
- **Esforço:** 1h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
