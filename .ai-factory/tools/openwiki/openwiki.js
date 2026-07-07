#!/usr/bin/env node

/**
 * NexusAuto OpenWiki - Documentação Automática para Agentes de IA
 * 
 * Gera e mantém documentação自动更新 para o NexusAuto AI Factory
 * Integrado com memória hierárquica e sistema de handoffs
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const CONFIG = {
  outputDir: path.join(process.cwd(), '.ai-factory', 'wiki'),
  excludePatterns: [
    'node_modules',
    '.git',
    'dist',
    'build',
    '*.test.*',
    '*.spec.*',
    'coverage',
    '.venv',
    '__pycache__'
  ],
  includePatterns: [
    '**/*.md',
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
    '**/*.py',
    '**/*.yml',
    '**/*.yaml',
    '**/*.json'
  ],
  maxFileSize: 1024 * 1024, // 1MB
  contextTokens: 500
};

// Estrutura da Wiki
const WIKI_STRUCTURE = {
  'README.md': 'Visão geral da documentação',
  'architecture/': 'Arquitetura do sistema',
  'agents/': 'Documentação dos agentes',
  'workflows/': 'Fluxos de trabalho',
  'api/': 'Referência de API',
  'memory/': 'Sistema de memória',
  'skills/': 'Catálogo de skills',
  'handoffs/': 'Protocolos de handoff'
};

class NexusOpenWiki {
  constructor(options = {}) {
    this.options = options;
    this.outputDir = options.outputDir || CONFIG.outputDir;
    this.verbose = options.verbose || false;
  }

  log(message) {
    if (this.verbose) {
      console.log(`[OpenWiki] ${message}`);
    }
  }

  async initialize() {
    this.log('Inicializando NexusOpenWiki...');
    
    // Criar estrutura de diretórios
    for (const [dir, description] of Object.entries(WIKI_STRUCTURE)) {
      if (dir.endsWith('/')) {
        const dirPath = path.join(this.outputDir, dir);
        await fs.mkdir(dirPath, { recursive: true });
        this.log(`Criado: ${dir}`);
      }
    }

    // Criar README principal
    await this.createReadme();
    
    this.log('Inicialização completa!');
  }

  async createReadme() {
    const readme = `# NexusAuto Wiki

Documentação automática gerada por NexusOpenWiki.

## Estrutura

${Object.entries(WIKI_STRUCTURE)
  .map(([item, desc]) => `- **${item}** - ${desc}`)
  .join('\n')}

## Atualização Automática

Esta wiki é atualizada automaticamente via GitHub Actions.

## Integração com Agentes

Os agentes do NexusAuto usam esta wiki para:
- Entender a arquitetura do sistema
- Localizar padrões e standards
- Encontrar exemplos de implementação
- Compreender fluxos de trabalho

## Comandos

\`\`\`bash
# Gerar documentação inicial
node .ai-factory/tools/openwiki/openwiki.js --init

# Atualizar documentação
node .ai-factory/tools/openwiki/openwiki.js --update

# Modo interativo
node .ai-factory/tools/openwiki/openwiki.js --chat

# One-shot
node .ai-factory/tools/openwiki/openwiki.js -p "Descreva a arquitetura"
\`\`\`

---

*Última atualização: ${new Date().toISOString()}*
`;

    await fs.writeFile(
      path.join(this.outputDir, 'README.md'),
      readme,
      'utf-8'
    );
  }

  async scanRepository() {
    this.log('Escaneando repositório...');
    
    const files = [];
    const rootDir = process.cwd();
    
    const scanDir = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(rootDir, fullPath);
        
        // Verificar exclusões
        if (this.shouldExclude(relativePath)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile()) {
          const stats = await fs.stat(fullPath);
          if (stats.size < CONFIG.maxFileSize) {
            files.push({
              path: relativePath,
              size: stats.size,
              extension: path.extname(relativePath)
            });
          }
        }
      }
    };
    
    await scanDir(rootDir);
    
    this.log(`Encontrados ${files.length} arquivos`);
    return files;
  }

  shouldExclude(filePath) {
    return CONFIG.excludePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(filePath);
      }
      return filePath.includes(pattern);
    });
  }

  async generateDocumentation(files) {
    this.log('Gerando documentação...');
    
    // Agrupar por tipo
    const grouped = {
      agents: files.filter(f => f.path.includes('.ai-factory/agents/')),
      skills: files.filter(f => f.path.includes('skills/')),
      workflows: files.filter(f => f.path.includes('workflows/')),
      memory: files.filter(f => f.path.includes('memory') || f.path.includes('brain/')),
      architecture: files.filter(f => 
        f.path.includes('architecture') || 
        f.path.includes('ARCHITECTURE') ||
        f.path.includes('.ai-factory/') && !f.path.includes('agents/')
      ),
      api: files.filter(f => 
        f.path.includes('backend/') || 
        f.path.includes('api') ||
        f.path.includes('routes')
      ),
      handoffs: files.filter(f => f.path.includes('handoffs/'))
    };

    // Gerar docs por seção
    for (const [section, sectionFiles] of Object.entries(grouped)) {
      if (sectionFiles.length > 0) {
        await this.generateSectionDoc(section, sectionFiles);
      }
    }

    // Gerar índice geral
    await this.generateIndex(grouped);
    
    this.log('Documentação gerada com sucesso!');
  }

  async generateSectionDoc(section, files) {
    const content = `# ${section.charAt(0).toUpperCase() + section.slice(1)}

## Visão Geral

Esta seção contém documentação sobre **${section}** do NexusAuto.

## Arquivos

${files.map(f => `- [\`${f.path}\`](../${f.path}) - ${this.formatFileSize(f.size)}`).join('\n')}

## Estatísticas

- **Total de arquivos:** ${files.length}
- **Tamanho total:** ${this.formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}

## Estrutura

${this.generateStructureTree(files)}

---

*Gerado automaticamente em ${new Date().toISOString()}*
`;

    const outputPath = path.join(
      this.outputDir,
      section === 'api' ? 'api' : section,
      'INDEX.md'
    );
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf-8');
  }

  generateStructureTree(files) {
    const tree = {};
    
    files.forEach(f => {
      const parts = f.path.split(path.sep);
      let current = tree;
      
      parts.forEach((part, i) => {
        if (i === parts.length - 1) {
          current[part] = null;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    });
    
    const renderTree = (obj, prefix = '') => {
      let result = '';
      for (const [key, value] of Object.entries(obj)) {
        result += `${prefix}- ${key}\n`;
        if (value) {
          result += renderTree(value, prefix + '  ');
        }
      }
      return result;
    };
    
    return '```\n' + renderTree(tree) + '```';
  }

  async generateIndex(grouped) {
    const totalFiles = Object.values(grouped).reduce((sum, files) => sum + files.length, 0);
    const totalSize = Object.values(grouped).reduce((sum, files) => 
      sum + files.reduce((s, f) => s + f.size, 0), 0
    );

    const index = `# Índice Geral - NexusAuto Wiki

## Estatísticas Gerais

- **Total de arquivos documentados:** ${totalFiles}
- **Tamanho total:** ${this.formatFileSize(totalSize)}
- **Última atualização:** ${new Date().toISOString()}

## Seções

| Seção | Arquivos | Tamanho |
|-------|----------|---------|
${Object.entries(grouped).map(([section, files]) => 
  `| ${section} | ${files.length} | ${this.formatFileSize(files.reduce((s, f) => s + f.size, 0))} |`
).join('\n')}

## Links Rápidos

${Object.entries(grouped).map(([section, _]) => 
  `- [${section.charAt(0).toUpperCase() + section.slice(1)}](${section}/INDEX.md)`
).join('\n')}

## Integração com Agentes

Os agentes do NexusAuto devem consultar esta wiki para:

1. **Entender contexto** - Ler a seção relevante antes de iniciar tarefas
2. **Seguir padrões** - Verificar standards e best practices
3. **Reutilizar código** - Encontrar exemplos e padrões existentes
4. **Documentar mudanças** - Atualizar esta wiki após mudanças significativas

## Atualização Automática

Esta wiki é atualizada automaticamente via:
- GitHub Actions (diário)
- Commit hooks (mudanças significativas)
- Comando manual (\`--update\`)

---

*Gerado automaticamente por NexusOpenWiki*
`;

    await fs.writeFile(
      path.join(this.outputDir, 'INDEX.md'),
      index,
      'utf-8'
    );
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  async getRecentChanges() {
    try {
      const gitLog = execSync('git log --since="24 hours ago" --name-only --pretty=format:""', {
        encoding: 'utf-8'
      });
      
      const changedFiles = gitLog
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(file => ({ path: file.trim() }));
      
      this.log(`${changedFiles.length} arquivos modificados nas últimas 24h`);
      return changedFiles;
    } catch (error) {
      this.log('Não foi possível obter mudanças do git');
      return [];
    }
  }

  async updateDocumentation() {
    this.log('Atualizando documentação...');
    
    // Obter mudanças recentes
    const recentChanges = await this.getRecentChanges();
    
    if (recentChanges.length === 0) {
      this.log('Nenhuma mudança recente para atualizar');
      return;
    }
    
    // Filtrar apenas arquivos relevantes
    const relevantChanges = recentChanges.filter(f => 
      !this.shouldExclude(f.path) && 
      f.path.startsWith('.ai-factory/') || 
      f.path.startsWith('backend/') ||
      f.path.startsWith('frontend/') ||
      f.path.startsWith('skills/')
    );
    
    this.log(`${relevantChanges.length} mudanças relevantes`);
    
    // Atualizar índice
    await this.initialize();
    
    // Escanear e gerar docs
    const files = await this.scanRepository();
    await this.generateDocumentation(files);
    
    // Registrar atualização
    await this.recordUpdate(relevantChanges);
    
    this.log('Atualização completa!');
  }

  async recordUpdate(changes) {
    const updateLog = {
      timestamp: new Date().toISOString(),
      changesCount: changes.length,
      changes: changes.slice(0, 50), // Máximo 50 mudanças
      version: '1.0.0'
    };
    
    const logPath = path.join(this.outputDir, '.update-log.json');
    
    let logs = [];
    try {
      const existing = await fs.readFile(logPath, 'utf-8');
      logs = JSON.parse(existing);
    } catch (e) {
      // Arquivo não existe, criar novo
    }
    
    logs.unshift(updateLog);
    
    // Manter apenas últimas 100 atualizações
    logs = logs.slice(0, 100);
    
    await fs.writeFile(logPath, JSON.stringify(logs, null, 2), 'utf-8');
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args.find(arg => arg.startsWith('--')) || args.find(arg => arg.startsWith('-'));
    
    switch (command) {
      case '--init':
        await this.initialize();
        const files = await this.scanRepository();
        await this.generateDocumentation(files);
        break;
      
      case '--update':
        await this.updateDocumentation();
        break;
      
      case '--chat':
        console.log('Modo interativo - em implementação');
        break;
      
      case '-p':
      case '--print':
        const prompt = args[args.indexOf(command) + 1];
        console.log(`Processando: ${prompt}`);
        // Implementação one-shot
        break;
      
      default:
        console.log(`
NexusOpenWiki - Documentação Automática para NexusAuto

Uso:
  node openwiki.js --init      # Inicializar wiki
  node openwiki.js --update    # Atualizar docs
  node openwiki.js --chat      # Modo interativo
  node openwiki.js -p "..."    # One-shot

Opções:
  --verbose, -v               # Logs detalhados
  --output, -o <dir>          # Diretório de output
        `);
    }
  }
}

// Executar
const wiki = new NexusOpenWiki({
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
});

wiki.run().catch(console.error);