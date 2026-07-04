---
name: criar-componente-react
description: "Cria um componente React funcional com TypeScript e Tailwind CSS"
agent: frontend-dev
tags: [frontend, react, typescript, tailwind]
version: 1.0.0
created: 2026-01-04
updated: 2026-01-04
---

# Propósito
Criar componentes React reutilizáveis, tipados com TypeScript e estilizados com Tailwind CSS, seguindo padrões de acessibilidade e boas práticas de performance.

# Trigger
Esta skill deve ser ativada quando:
- Solicitado para "criar componente React"
- Mencionado "novo componente" com props específicas
- Necessário implementar UI a partir de design/mockup
- Palavras-chave: "componente", "React", "TSX", "Tailwind"

# Instruções

## Passo 1: Receber Requisitos
- Nome do componente (PascalCase)
- Props necessárias com tipos
- Estado interno necessário (se houver)
- Eventos/interações esperadas

## Passo 2: Gerar Estrutura do Arquivo
Criar arquivo em `frontend/src/components/{ComponentName}/{ComponentName}.tsx`:

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface {ComponentName}Props {
  // Props aqui
  className?: string;
}

export function {ComponentName}({ className, ...props }: {ComponentName}Props) {
  return (
    <div className={cn('base-styles', className)} {...props}>
      {/* Conteúdo */}
    </div>
  );
}
```

## Passo 3: Adicionar Estilos Tailwind
- Usar classes utilitárias do Tailwind
- Seguir sistema de design (cores, espaçamento, tipografia)
- Implementar estados (hover, focus, active, disabled)
- Garantir contraste adequado (WCAG AA)

## Passo 4: Adicionar Acessibilidade
- Atributos ARIA quando necessário
- Suporte a navegação por teclado
- Focus visible
- Labels para inputs

## Passo 5: Exportar Componente
- Exportar como named export (preferível) ou default
- Criar index.ts para re-exportação se necessário

## Passo 6: Gerar Teste Básico
Criar arquivo `{ComponentName}.test.tsx` com Vitest:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { {ComponentName} } from './{ComponentName}';

describe('{ComponentName}', () => {
  it('renderiza corretamente', () => {
    render(<{ComponentName} />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});
```

# Inputs
- `name` (string): Nome do componente em PascalCase
- `props` (array): Lista de props com nome, tipo e descrição
- `variantes` (array, opcional): Variações do componente (ex: primary, secondary)
- `interacoes` (array, opcional): Eventos e interações esperadas

# Outputs
- Arquivo `.tsx` com componente funcional
- Arquivo `.test.tsx` com testes básicos
- Documentação inline (JSDoc) se complexo

# Exemplos

## Exemplo 1: Button Component
**Entrada:**
```
name: Button
props:
  - variant: 'primary' | 'secondary'
  - size: 'sm' | 'md' | 'lg'
  - children: React.ReactNode
  - onClick: () => void
  - disabled: boolean
```

**Saída:**
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Exemplo 2: Input Component
**Entrada:**
```
name: Input
props:
  - label: string
  - type: 'text' | 'email' | 'password'
  - placeholder: string
  - error: string | null
  - value: string
  - onChange: (value: string) => void
```

# Dependências
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- cn utility (clsx + tailwind-merge)
- Vitest (testes)
- @testing-library/react (testes)

# Links Relacionados
- [[brain/Patterns]] - Padrões de código React
- [[standards/frontend]] - Padrões frontend
- [[skills/development/integrar-api-rest]] - Integração com backend