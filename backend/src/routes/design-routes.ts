import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { validate } from '../middleware/validate.middleware';
import { GenerateDesignSchema, SaveDesignSchema } from '../dtos/design.dto';

const router = express.Router();

// UI/UX Pro Max Bridge placeholder (será implementado)
const UIUXProMaxBridge: any = null;

/**
 * POST /api/design/generate
 * Gera design system completo a partir de descrição
 */
router.post('/generate', validate(GenerateDesignSchema), async (req, res) => {
  const { description } = req.body;
  
  try {
    if (!UIUXProMaxBridge) {
      // Retorna mock se bridge não estiver disponível
      return res.json({
        layout: {
          pattern: 'Hero + Features + CTA + Footer',
          sections: [
            { name: 'Hero', description: 'Título impactante + subtítulo + CTA principal' },
            { name: 'Features', description: '3-4 cards com ícones e descrições curtas' },
            { name: 'CTA', description: 'Chamada final com formulário de captura' },
            { name: 'Footer', description: 'Links, copyright e redes sociais' }
          ]
        },
        palette: {
          primary: { hex: '#2C3E50', name: 'Deep Blue', usage: 'Botões, links, títulos' },
          secondary: { hex: '#8E8E8E', name: 'Gray', usage: 'Texto secundário, bordas' },
          accent: { hex: '#E8D5C4', name: 'Beige', usage: 'Destaques, hover states' },
          background: { hex: '#FFFFFF', name: 'White', usage: 'Fundos principais' },
          surface: { hex: '#F8F9FA', name: 'Light Gray', usage: 'Cards, seções alternadas' }
        },
        typography: {
          headings: {
            font: 'Playfair Display',
            weights: [700, 600],
            sizes: { h1: '48px', h2: '36px', h3: '24px', h4: '20px' }
          },
          body: {
            font: 'Lato',
            weights: [400, 500],
            sizes: { base: '16px', small: '14px', large: '18px' }
          },
          code: {
            font: 'JetBrains Mono',
            weights: [400],
            sizes: { base: '14px' }
          },
          scale: ['12px', '14px', '16px', '20px', '24px', '32px', '48px']
        },
        css_effects: [
          'Sombra suave: box-shadow: 0 2px 8px rgba(0,0,0,0.1)',
          'Transições: transition: all 300ms ease-in-out',
          'Hover states: transform: translateY(-2px)',
          'Overlays com gradiente: linear-gradient(135deg, ...)',
          'Border-radius: 8px (botões), 12px (cards)'
        ],
        anti_patterns: [
          'Evitar cores vibrantes demais (saturação > 80%)',
          'Não usar mais de 3 fontes diferentes',
          'Evitar animações que duram mais de 500ms',
          'Não usar texto com contraste < 4.5:1',
          'Evitar larguras de linha > 80 caracteres'
        ],
        checklist: [
          '✅ Acessibilidade: WCAG 2.1 AA (contraste, navegação por teclado)',
          '✅ Responsividade: Mobile-first, breakpoints em 640px, 768px, 1024px',
          '✅ Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms',
          '✅ SEO: Meta tags, headings hierárquicos, alt text em imagens',
          '✅ Forms: Validação em tempo real, mensagens de erro claras'
        ],
        mock: true,
        mock_reason: 'UI/UX Pro Max Bridge não disponível. Retornando resposta mockada para desenvolvimento.'
      });
    }
    
    const bridge = new UIUXProMaxBridge();
    const result = await bridge.generateDesign(description);
    res.json(result);
} catch (error: any) {
    console.error('❌ Erro ao gerar design:', error.message);
    res.status(500).json({ error: 'Erro ao gerar design' });
  }
});

/**
 * POST /api/design/save
 * Gera design system e salva como especificação
 */
router.post('/save', validate(SaveDesignSchema), async (req, res) => {
  const { description, featureName } = req.body;
  
  try {
    if (!UIUXProMaxBridge) {
      // Cria especificação mock
      const specsDir = path.join(process.cwd(), 'specs', featureName);
      await fs.mkdir(specsDir, { recursive: true });
      
      const specContent = `# Design System Specification - ${featureName}

*Gerado automaticamente por UI/UX Pro Max Agent (Mock)*

## 🎨 Layout Pattern
Hero + Features + CTA + Footer

## 🌈 Color Palette
| Nome | Hex | Uso |
|------|-----|-----|
| Primary | #2C3E50 | Botões, links, títulos |
| Secondary | #8E8E8E | Texto secundário, bordas |
| Accent | #E8D5C4 | Destaques, hover states |
| Background | #FFFFFF | Fundos principais |
| Surface | #F8F9FA | Cards, seções alternadas |

## 🔤 Typography
- **Headings:** Playfair Display (700, 600)
- **Body:** Lato (400, 500)
- **Code:** JetBrains Mono (400)
- **Escala:** 12px, 14px, 16px, 20px, 24px, 32px, 48px

## ✨ CSS Effects
- Sombra suave: box-shadow: 0 2px 8px rgba(0,0,0,0.1)
- Transições: transition: all 300ms ease-in-out
- Hover states: transform: translateY(-2px)
- Overlays com gradiente: linear-gradient(135deg, ...)
- Border-radius: 8px (botões), 12px (cards)

## 🚫 Anti-patterns to Avoid
- Evitar cores vibrantes demais (saturação > 80%)
- Não usar mais de 3 fontes diferentes
- Evitar animações que duram mais de 500ms
- Não usar texto com contraste < 4.5:1
- Evitar larguras de linha > 80 caracteres

## ✅ Pre-build Checklist
- [ ] Acessibilidade: WCAG 2.1 AA (contraste, navegação por teclado)
- [ ] Responsividade: Mobile-first, breakpoints em 640px, 768px, 1024px
- [ ] Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] SEO: Meta tags, headings hierárquicos, alt text em imagens
- [ ] Forms: Validação em tempo real, mensagens de erro claras

---

> ⚠️ **Nota:** Este design foi gerado em modo mock (módulo UI/UX Pro Max não disponível).
> Para produção, instale o módulo: \`git submodule add <repo> ui-ux-pro-max\`
`;
      
      const specPath = path.join(specsDir, 'design-spec.md');
      await fs.writeFile(specPath, specContent, 'utf-8');
      
      return res.json({
        success: true,
        specPath: specPath,
        mock: true,
        mock_reason: 'UI/UX Pro Max Bridge não disponível. Especificação mockada gerada.'
      });
    }
    
    const bridge = new UIUXProMaxBridge();
    const result = await bridge.generateAndSaveSpec(description, featureName);
    res.json(result);
} catch (error: any) {
    console.error('❌ Erro ao gerar full design:', error.message);
    res.status(500).json({ error: 'Erro ao gerar full design' });
  }
});

/**
 * POST /api/design/palette
 * Gera apenas a paleta de cores
 */
router.post('/palette', validate(GenerateDesignSchema), async (req, res) => {
  const { description } = req.body;
  
  try {
    if (!UIUXProMaxBridge) {
      return res.json({
        palette: {
          primary: { hex: '#2C3E50', name: 'Deep Blue', usage: 'Botões, links, títulos' },
          secondary: { hex: '#8E8E8E', name: 'Gray', usage: 'Texto secundário, bordas' },
          accent: { hex: '#E8D5C4', name: 'Beige', usage: 'Destaques, hover states' },
          background: { hex: '#FFFFFF', name: 'White', usage: 'Fundos principais' },
          surface: { hex: '#F8F9FA', name: 'Light Gray', usage: 'Cards, seções alternadas' }
        },
        mock: true
      });
    }
    
    const bridge = new UIUXProMaxBridge();
    const palette = await bridge.extractPalette(description);
    res.json({ palette, mock: !palette });
} catch (error: any) {
    console.error('❌ Erro ao gerar palette:', error.message);
    res.status(500).json({ error: 'Erro ao gerar palette' });
  }
});

/**
 * POST /api/design/typography
 * Gera apenas a tipografia
 */
router.post('/typography', validate(GenerateDesignSchema), async (req, res) => {
  const { description } = req.body;
  
  try {
    if (!UIUXProMaxBridge) {
      return res.json({
        typography: {
          headings: {
            font: 'Playfair Display',
            weights: [700, 600],
            sizes: { h1: '48px', h2: '36px', h3: '24px', h4: '20px' }
          },
          body: {
            font: 'Lato',
            weights: [400, 500],
            sizes: { base: '16px', small: '14px', large: '18px' }
          },
          code: {
            font: 'JetBrains Mono',
            weights: [400],
            sizes: { base: '14px' }
          },
          scale: ['12px', '14px', '16px', '20px', '24px', '32px', '48px']
        },
        mock: true
      });
    }
    
    const bridge = new UIUXProMaxBridge();
    const typography = await bridge.extractTypography(description);
    res.json({ typography, mock: !typography });
} catch (error: any) {
    console.error('❌ Erro ao gerar typography:', error.message);
    res.status(500).json({ error: 'Erro ao gerar typography' });
  }
});

/**
 * POST /api/design/checklist
 * Gera apenas o checklist
 */
router.post('/checklist', validate(GenerateDesignSchema), async (req, res) => {
  const { description } = req.body;
  
  try {
    if (!UIUXProMaxBridge) {
      return res.json({
        checklist: [
          '✅ Acessibilidade: WCAG 2.1 AA (contraste, navegação por teclado)',
          '✅ Responsividade: Mobile-first, breakpoints em 640px, 768px, 1024px',
          '✅ Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms',
          '✅ SEO: Meta tags, headings hierárquicos, alt text em imagens',
          '✅ Forms: Validação em tempo real, mensagens de erro claras'
        ],
        mock: true
      });
    }
    
    const bridge = new UIUXProMaxBridge();
    const checklist = await bridge.extractChecklist(description);
    res.json({ checklist, mock: !checklist });
} catch (error: any) {
    console.error('❌ Erro ao gerar components:', error.message);
    res.status(500).json({ error: 'Erro ao gerar components' });
  }
});

/**
 * GET /api/design/status
 * Verifica se o módulo UI/UX Pro Max está disponível
 */
router.get('/status', async (req, res) => {
  interface StatusResponse {
  submodule: boolean;
  wrapper: boolean;
  bridge: boolean;
  core: boolean;
  routes: boolean;
  ready: boolean;
  message: string;
  error?: string;
}

const status: StatusResponse = {
    submodule: false,
    wrapper: false,
    bridge: false,
    core: false,
    routes: true,
    ready: false,
    message: ''
  };
  
  try {
    // Verifica submódulo
    const submodulePath = path.join(process.cwd(), 'ui-ux-pro-max');
    try {
      await fs.access(submodulePath);
      status.submodule = true;
    } catch {
      status.submodule = false;
    }
    
    // Verifica wrapper Python
    const wrapperPath = path.join(__dirname, '../../../.ai-factory/scripts/ui-ux-pro-max-wrapper.py');
    try {
      await fs.access(wrapperPath);
      status.wrapper = true;
    } catch {
      status.wrapper = false;
    }
    
    // Verifica bridge Node.js
    const bridgePath = path.join(__dirname, '../../../.ai-factory/scripts/ui-ux-pro-max-bridge.js');
    try {
      await fs.access(bridgePath);
      status.bridge = true;
    } catch {
      status.bridge = false;
    }
    
    // Verifica core.py
    const corePath = path.join(submodulePath, 'core.py');
    try {
      await fs.access(corePath);
      status.core = true;
    } catch {
      status.core = false;
    }
    
    // Status geral
    status.ready = status.submodule && status.wrapper && status.bridge && status.core;
    status.message = status.ready 
      ? '🟢 Pronto para uso' 
      : '🔴 Módulo não disponível (usando modo mock)';
    
  } catch (error: any) {
    status.error = error instanceof Error ? error.message : 'Unknown error';
    status.message = '❌ Erro ao verificar status';
  }
  
  res.json(status);
});

export default router;