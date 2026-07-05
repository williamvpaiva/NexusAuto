# 07 — UI COMPONENTS

> Design system, componentes reutilizáveis, Loading/Error/Skeleton states e testes visuais
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** Nenhuma

---

## 📋 Tarefas

### UI-001 — Design Tokens e Tema Global
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Definir e implementar design tokens (cores, tipografia, spacing, border-radius, shadows) como variáveis CSS e tema React Context
- **Critério de aceite:** Tokens disponíveis em CSS custom properties e tema JSX; troca light/dark mode funcional
- **Esforço:** 3h
- **Prioridade:** Alta

### UI-002 — Componente de Loading (Spinner/Skeleton)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar componentes Loading (spinner animado) e Skeleton (placeholder shimmer) para estados de carregamento
- **Critério de aceite:** LoadingSpinner exibe animação CSS pura; Skeleton aceita `width`, `height`, `borderRadius`; ambos aceitam `size` prop
- **Esforço:** 2h
- **Prioridade:** Alta

### UI-003 — Componente de ErrorBoundary + ErrorFallback
- [ ] **Status:** 🔴 Pendente
- **Descrição:** ErrorBoundary React que captura erros de renderização e exibe ErrorFallback com mensagem amigável, botão "Tentar novamente" e suporte a onRetry
- **Critério de aceite:** Erro em componente filho → ErrorFallback visível → clique em "Tentar novamente" → remonta children
- **Esforço:** 2h
- **Prioridade:** Alta

### UI-004 — Empty State Component
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Componente EmptyState com ícone, título, descrição e CTA (opcional) para listas vazias
- **Critério de aceite:** `<EmptyState icon="inbox" title="Nenhuma mensagem" action={{ label: "Nova mensagem", onClick }} />` renderiza corretamente
- **Esforço:** 1h
- **Prioridade:** Média

### UI-005 — Componentes de Formulário Tema
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar wrappers temáticos para Input, Select, Textarea, Checkbox e Button com validação visual (error state, disabled, loading state)
- **Critério de aceite:** Input com `error` exibe borda vermelha + mensagem; Button com `loading` exibe spinner e desabilita clique
- **Esforço:** 4h
- **Prioridade:** Alta

### UI-006 — Toast/Notification System
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Sistema de notificações toast com posicionamento configurável, fila, auto-dismiss, tipos (success/error/warning/info) e animação
- **Critério de aceite:** `toast.success("Salvo!")` exibe notificação por 3s; fila de até 5 toasts animados; fechamento manual via X
- **Esforço:** 3h
- **Prioridade:** Média

### UI-007 — Modal/Dialog Component
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Componente Modal acessível com backdrop, focus trap, fechamento por ESC/clique fora e animação de entrada/saída
- **Critério de aceite:** Modal aberto → focus no primeiro input; ESC fecha; backdrop clique fecha; animação CSS transition
- **Esforço:** 2h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
