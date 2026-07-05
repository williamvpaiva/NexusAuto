---
name: web-artifacts-builder
description: Gera artefatos web interativos completos (HTML/CSS/JS) para demos, protótipos, landing pages, dashboards e ferramentas interativas. Use quando precisar criar páginas web funcionais que o usuário pode visualizar e interagir.
---

# Web Artifacts Builder

## Visão Geral

Esta skill cria artefatos web completos e funcionais usando HTML, CSS e JavaScript. Os artefatos são otimizados para visualização imediata em ambientes que suportam rendering de HTML.

**Palavras-chave**: artefato web, HTML, CSS, JavaScript, página web, demo interativa, protótipo, landing page, dashboard

---

## Princípios de Construção

### 1. Self-Contained

Cada artefato deve ser **completo e independente**:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Título Descritivo]</title>
    <!-- Todos os estilos inline ou em <style> -->
    <!-- Todos os scripts inline ou em <script> -->
</head>
<body>
    <!-- Conteúdo completo -->
</body>
</html>
```

### 2. Instant Visual Impact

O artefato deve ser **visualmente impressionante desde o primeiro load**:

- Hero section forte
- Tipografia clara e hierárquica
- Cores consistentes (use brand-guidelines ou theme-factory)
- Espaçamento generoso
- Loading state se necessário

### 3. Interactive by Default

Sempre que possível, adicione **interatividade significativa**:

```javascript
// ✅ Bom: Interações que servem ao propósito
- Click handlers para ações principais
- Hover states para feedback
- Form validation em tempo real
- Toggle/accordion para conteúdo expansível
- Search/filter para listas

// ❌ Evite: Interações sem propósito
- Animações excessivas
- Hover effects que não informam
- Clicks que não fazem nada
```

### 4. Mobile-First

Sempre construa responsivo:

```css
/* Base: mobile */
.container {
    padding: 16px;
    width: 100%;
}

/* Tablet+ */
@media (min-width: 640px) {
    .container {
        padding: 32px;
        max-width: 640px;
        margin: 0 auto;
    }
}

/* Desktop+ */
@media (min-width: 1024px) {
    .container {
        max-width: 1024px;
    }
}
```

---

## Estrutura de Artefato Padrão

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusAuto - [Nome do Artefato]</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <style>
        /* CSS Reset */
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        /* CSS Variables */
        :root {
            /* Cores do NexusAuto */
            --color-primary: #3B82F6;
            --color-secondary: #8B5CF6;
            --color-accent: #F97316;
            --color-background: #F8FAFC;
            --color-surface: #FFFFFF;
            --color-text: #0F172A;
            --color-text-secondary: #64748B;
            --color-border: #E2E8F0;
            
            /* Typography */
            --font-sans: 'Inter', system-ui, sans-serif;
            
            /* Spacing */
            --space-1: 4px;
            --space-2: 8px;
            --space-3: 16px;
            --space-4: 24px;
            --space-5: 32px;
            --space-6: 48px;
            
            /* Border Radius */
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
            
            /* Shadows */
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
            --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
        }
        
        /* Base Styles */
        body {
            font-family: var(--font-sans);
            background: var(--color-background);
            color: var(--color-text);
            line-height: 1.6;
        }
        
        /* Component Styles */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            font-weight: 500;
            border-radius: var(--radius-md);
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .btn-primary {
            background: var(--color-primary);
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563EB;
            transform: translateY(-1px);
        }
        
        /* Layout */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--space-3);
        }
        
        /* Utility Classes */
        .text-center { text-align: center; }
        .mt-4 { margin-top: var(--space-4); }
        .mb-4 { margin-bottom: var(--space-4); }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-3 { gap: var(--space-3); }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="bg-surface border-b">
        <div class="container">
            <nav class="flex items-center justify-between py-4">
                <div class="logo">
                    <span class="text-xl font-bold">NexusAuto</span>
                </div>
                <ul class="flex gap-3">
                    <li><a href="#features" class="text-secondary hover:primary">Features</a></li>
                    <li><a href="#pricing" class="text-secondary hover:primary">Pricing</a></li>
                    <li><a href="#contact" class="text-secondary hover:primary">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <!-- Main Content -->
    <main>
        <!-- Hero Section -->
        <section class="py-6 bg-gradient">
            <div class="container">
                <h1 class="text-4xl font-bold mb-4">
                    [Headline Impactante]
                </h1>
                <p class="text-xl text-secondary mb-6">
                    [Subheadline que explica o valor]
                </p>
                <div class="flex gap-3">
                    <button class="btn btn-primary">
                        Call to Action
                    </button>
                    <button class="btn btn-secondary">
                        Secondary Action
                    </button>
                </div>
            </div>
        </section>
        
        <!-- Features Section -->
        <section id="features" class="py-6">
            <div class="container">
                <h2 class="text-3xl font-bold text-center mb-6">
                    Features
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Feature Cards -->
                </div>
            </div>
        </section>
    </main>
    
    <!-- Footer -->
    <footer class="bg-dark text-light py-6">
        <div class="container">
            <p class="text-center">
                © 2026 NexusAuto. All rights reserved.
            </p>
        </div>
    </footer>
    
    <!-- Scripts -->
    <script>
        // Interactive functionality
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Handle click
            });
        });
        
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Analytics placeholder
        console.log('Page loaded:', new Date().toISOString());
    </script>
</body>
</html>
```

---

## Templates por Tipo de Artefato

### 1. Landing Page

```json
{
  "type": "landing-page",
  "sections": [
    "header",
    "hero",
    "social-proof",
    "features",
    "how-it-works",
    "pricing",
    "testimonials",
    "faq",
    "cta-final",
    "footer"
  ],
  "goal": "Conversão (signup, demo, compra)"
}
```

### 2. Dashboard

```json
{
  "type": "dashboard",
  "sections": [
    "sidebar-nav",
    "top-bar",
    "kpi-cards",
    "charts",
    "data-table",
    "filters"
  ],
  "goal": "Visualização e análise de dados"
}
```

### 3. Documentation Page

```json
{
  "type": "documentation",
  "sections": [
    "sidebar-nav",
    "search-bar",
    "content-area",
    "table-of-contents",
    "feedback-section",
    "next-prev-nav"
  ],
  "goal": "Educação e referência"
}
```

### 4. Interactive Demo

```json
{
  "type": "interactive-demo",
  "sections": [
    "intro",
    "step-by-step",
    "interactive-element",
    "results-display",
    "explanation"
  ],
  "goal": "Demonstração hands-on"
}
```

### 5. Form/Application

```json
{
  "type": "form",
  "sections": [
    "progress-indicator",
    "form-steps",
    "validation",
    "confirmation",
    "help-text"
  ],
  "goal": "Coleta de informações"
}
```

---

## Componentes Reutilizáveis

### Button Variants

```css
.btn-primary {
    background: var(--color-primary);
    color: white;
}

.btn-secondary {
    background: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
}

.btn-ghost {
    background: transparent;
    color: var(--color-text-secondary);
}

.btn-danger {
    background: var(--color-error);
    color: white;
}

.btn-sm {
    padding: 8px 16px;
    font-size: 14px;
}

.btn-lg {
    padding: 16px 32px;
    font-size: 18px;
}
```

### Card Variants

```css
.card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    box-shadow: var(--shadow-sm);
}

.card-hover {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card-hover:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.card-feature {
    text-align: center;
}

.card-feature .icon {
    font-size: 32px;
    margin-bottom: var(--space-3);
}
```

### Form Elements

```css
.input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 16px;
    transition: border-color 0.2s;
}

.input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-error {
    border-color: var(--color-error);
}

.label {
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
}

.help-text {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin-top: 4px;
}
```

---

## Interatividade Comum

### Toggle/Accordion

```javascript
function setupAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            
            trigger.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? '0' : content.scrollHeight + 'px';
        });
    });
}
```

### Tab Navigation

```javascript
function setupTabs() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        const triggers = tabContainer.querySelectorAll('.tab-trigger');
        const panels = tabContainer.querySelectorAll('.tab-panel');
        
        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                triggers.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                trigger.classList.add('active');
                panels[index].classList.add('active');
            });
        });
    });
}
```

### Modal

```javascript
function setupModal() {
    const modal = document.getElementById('modal');
    const openBtn = document.getElementById('modal-open');
    const closeBtn = document.getElementById('modal-close');
    
    openBtn.addEventListener('click', () => {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}
```

---

## Check de Qualidade

Antes de entregar o artefato:

- [ ] **HTML semântico**: Usou header, main, footer, section, article?
- [ ] **Acessibilidade**: Labels em forms, aria-attributes, alt text?
- [ ] **Responsivo**: Funciona em mobile, tablet, desktop?
- [ ] **Performance**: CSS/JS minificados, imagens otimizadas?
- [ ] **Contraste**: Cores passam WCAG AA?
- [ ] **Focus states**: Navegação por keyboard funciona?
- [ ] **Error handling**: Forms validam e mostram erros?
- [ ] **Loading states**: Feedback visual durante async?
- [ ] **Cross-browser**: Funciona em Chrome, Firefox, Safari?

---

## Quando Usar Esta Skill

Use quando:

1. Criar landing page para produto/service
2. Prototipar interface rapidamente
3. Demonstrar conceito interativo
4. Gerar dashboard de dados
5. Criar documentação com navegação
6. Construir form ou aplicação simples
7. Visualizar design antes de implementar

**Trigger phrases**: "criar página web", "artefato HTML", "demo interativa", "landing page", "dashboard", "protótipo web", "frontend artifact"