import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execPromise = promisify(exec);

/**
 * UI/UX Pro Max Bridge - NexusAuto
 * Bridge Node.js para o módulo UI/UX Pro Max
 * 
 * Este script chama o wrapper Python e expõe uma API para o Tech Lead.
 */
class UIUXProMaxBridge {
  constructor() {
    this.wrapperPath = path.join(__dirname, 'ui-ux-pro-max-wrapper.py');
    this.specsDir = path.join(process.cwd(), 'specs');
  }

  /**
   * Gera design system completo a partir de descrição
   * @param {string} description - Descrição do projeto
   * @returns {Promise<object>} Resultado do design system
   */
  async generateDesign(description) {
    try {
      const command = `python3 "${this.wrapperPath}" "${description}"`;
      const { stdout, stderr } = await execPromise(command);
      
      if (stderr) {
        console.warn('⚠️ Wrapper stderr:', stderr);
      }
      
      const result = JSON.parse(stdout);
      return result;
    } catch (error) {
      console.error('❌ Erro ao gerar design:', error);
      return { error: error.message };
    }
  }

  /**
   * Extrai apenas a paleta de cores
   * @param {string} description - Descrição do projeto
   * @returns {Promise<object|null>} Paleta de cores ou null
   */
  async extractPalette(description) {
    const result = await this.generateDesign(description);
    return result.palette || null;
  }

  /**
   * Extrai apenas a tipografia
   * @param {string} description - Descrição do projeto
   * @returns {Promise<object|null>} Tipografia ou null
   */
  async extractTypography(description) {
    const result = await this.generateDesign(description);
    return result.typography || null;
  }

  /**
   * Extrai apenas o checklist
   * @param {string} description - Descrição do projeto
   * @returns {Promise<object|null>} Checklist ou null
   */
  async extractChecklist(description) {
    const result = await this.generateDesign(description);
    return result.checklist || null;
  }

  /**
   * Gera e salva como especificação de design
   * @param {string} description - Descrição do projeto
   * @param {string} featureName - Nome da feature para o diretório
   * @returns {Promise<object>} Resultado com caminho do arquivo
   */
  async generateAndSaveSpec(description, featureName) {
    const result = await this.generateDesign(description);
    
    if (result.error) {
      return { error: result.error };
    }

    // Cria diretório de specs
    const specDir = path.join(this.specsDir, featureName);
    await fs.mkdir(specDir, { recursive: true });

    // Gera conteúdo do design-spec.md
    const specContent = this.formatDesignSpec(featureName, result);

    // Salva arquivo
    const specPath = path.join(specDir, 'design-spec.md');
    await fs.writeFile(specPath, specContent, 'utf-8');
    
    return {
      success: true,
      specPath: specPath,
      design: result,
      mock: result.mock || false
    };
  }

  /**
   * Formata o resultado como Markdown
   * @param {string} featureName - Nome da feature
   * @param {object} result - Resultado do design system
   * @returns {string} Conteúdo formatado em Markdown
   */
  formatDesignSpec(featureName, result) {
    const sections = [];

    // Header
    sections.push(`# Design System Specification - ${featureName}`);
    sections.push('');
    sections.push(`*Gerado automaticamente por UI/UX Pro Max Agent*`);
    sections.push('');

    // Layout
    if (result.layout) {
      sections.push('## 🎨 Layout Pattern');
      sections.push('');
      if (typeof result.layout === 'string') {
        sections.push(result.layout);
      } else if (result.layout.pattern) {
        sections.push(`**Pattern:** ${result.layout.pattern}`);
        sections.push('');
        if (result.layout.sections) {
          sections.push('### Seções');
          sections.push('');
          result.layout.sections.forEach(section => {
            sections.push(`- **${section.name}:** ${section.description}`);
          });
        }
      }
      sections.push('');
    }

    // Visual Style
    if (result.visual_style) {
      sections.push('## 🎨 Visual Style');
      sections.push('');
      sections.push(result.visual_style);
      sections.push('');
    }

    // Color Palette
    if (result.palette) {
      sections.push('## 🌈 Color Palette');
      sections.push('');
      sections.push('| Nome | Hex | Uso |');
      sections.push('|------|-----|-----|');
      
      Object.entries(result.palette).forEach(([name, color]) => {
        if (typeof color === 'string') {
          sections.push(`| ${name} | ${color} | - |`);
        } else if (color.hex) {
          sections.push(`| ${color.name || name} | ${color.hex} | ${color.usage || '-'} |`);
        }
      });
      sections.push('');
    }

    // Typography
    if (result.typography) {
      sections.push('## 🔤 Typography');
      sections.push('');
      
      if (result.typography.headings) {
        const headings = result.typography.headings;
        sections.push(`- **Headings:** ${headings.font} (${headings.weights?.join(', ') || ''})`);
        if (headings.sizes) {
          Object.entries(headings.sizes).forEach(([level, size]) => {
            sections.push(`  - ${level.toUpperCase()}: ${size}`);
          });
        }
      }
      
      if (result.typography.body) {
        const body = result.typography.body;
        sections.push(`- **Body:** ${body.font} (${body.weights?.join(', ') || ''})`);
        if (body.sizes) {
          Object.entries(body.sizes).forEach(([level, size]) => {
            sections.push(`  - ${level}: ${size}`);
          });
        }
      }
      
      if (result.typography.code) {
        const code = result.typography.code;
        sections.push(`- **Code:** ${code.font} (${code.weights?.join(', ') || ''})`);
      }
      
      if (result.typography.scale) {
        sections.push(`- **Escala:** ${result.typography.scale.join(', ')}`);
      }
      
      sections.push('');
    }

    // CSS Effects
    if (result.css_effects) {
      sections.push('## ✨ CSS Effects');
      sections.push('');
      if (Array.isArray(result.css_effects)) {
        result.css_effects.forEach(effect => {
          sections.push(`- ${effect}`);
        });
      } else {
        sections.push(result.css_effects);
      }
      sections.push('');
    }

    // Anti-patterns
    if (result.anti_patterns) {
      sections.push('## 🚫 Anti-patterns to Avoid');
      sections.push('');
      if (Array.isArray(result.anti_patterns)) {
        result.anti_patterns.forEach(pattern => {
          sections.push(`- ${pattern}`);
        });
      } else {
        sections.push(result.anti_patterns);
      }
      sections.push('');
    }

    // Checklist
    if (result.checklist) {
      sections.push('## ✅ Pre-build Checklist');
      sections.push('');
      if (Array.isArray(result.checklist)) {
        result.checklist.forEach(item => {
          sections.push(`- [ ] ${item.replace('✅ ', '')}`);
        });
      } else {
        sections.push(result.checklist);
      }
      sections.push('');
    }

    // Mock warning
    if (result.mock) {
      sections.push('---');
      sections.push('');
      sections.push('> ⚠️ **Nota:** Este design foi gerado em modo mock (módulo UI/UX Pro Max não disponível).');
      sections.push('> Para produção, instale o módulo: `git submodule add <repo> ui-ux-pro-max`');
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * Verifica se o módulo UI/UX Pro Max está disponível
   * @returns {Promise<object>} Status do módulo
   */
  async checkStatus() {
    const status = {
      submodule: false,
      wrapper: false,
      bridge: true,
      core: false,
      ready: false
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
      try {
        await fs.access(this.wrapperPath);
        status.wrapper = true;
      } catch {
        status.wrapper = false;
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
      status.ready = status.submodule && status.wrapper && status.core;
      status.message = status.ready 
        ? '🟢 Pronto para uso' 
        : '🔴 Módulo não disponível (usando modo mock)';

    } catch (error) {
      status.error = error.message;
      status.message = '❌ Erro ao verificar status';
    }

    return status;
  }
}

export default UIUXProMaxBridge;