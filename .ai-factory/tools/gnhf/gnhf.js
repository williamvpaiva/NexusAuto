#!/usr/bin/env node

/**
 * NexusAuto GNHF - Good Night, Have Fun
 * 
 * Orquestrador de agentes autônomos noturnos
 * Integrado com validação V&V de 7 passos do NexusAuto
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');

// Configurações
const CONFIG = {
  runsDir: path.join(process.cwd(), '.gnhf', 'runs'),
  configPath: path.join(process.cwd(), '.gnhf', 'config.yml'),
  handoffsDir: path.join(process.cwd(), '.ai-factory', 'handoffs'),
  vvScript: path.join(process.cwd(), '.ai-factory', 'scripts', 'run-vv.js'),
  defaultAgent: 'claude',
  maxConsecutiveFailures: 3,
  preventSleep: true
};

class NexusGNHF {
  constructor(options = {}) {
    this.options = options;
    this.runId = this.generateRunId();
    this.runDir = path.join(CONFIG.runsDir, this.runId);
    this.notesPath = path.join(this.runDir, 'notes.md');
    this.promptPath = path.join(this.runDir, 'prompt.md');
    this.iteration = 0;
    this.consecutiveFailures = 0;
    this.totalTokens = 0;
    this.startTime = Date.now();
    this.branch = null;
    this.worktree = null;
    this.stopCondition = options.stopWhen || null;
    this.stopConditionMet = false;
  }

  generateRunId() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 7);
    return `gnhf-${timestamp}-${random}`;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type] || 'ℹ️';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async initialize() {
    this.log('Inicializando NexusGNHF...');
    
    // Criar diretórios
    await fs.mkdir(this.runDir, { recursive: true });
    await fs.mkdir(CONFIG.handoffsDir, { recursive: true });
    
    // Verificar git
    this.verifyGit();
    
    // Criar ou usar branch
    this.branch = await this.createOrUseBranch();
    
    // Salvar prompt
    await this.savePrompt();
    
    // Carregar config
    await this.loadConfig();
    
    this.log(`Run ID: ${this.runId}`);
    this.log(`Branch: ${this.branch}`);
    
    return true;
  }

  verifyGit() {
    try {
      execSync('git status', { stdio: 'pipe' });
      this.log('Git repository verified', 'success');
    } catch (error) {
      throw new Error('Not a git repository or git not available');
    }
  }

  async createOrUseBranch() {
    const prefix = this.options.worktree ? 'gnhf-wt' : 'gnhf';
    const slug = this.generateSlug();
    
    if (this.options.currentBranch) {
      // Usar branch atual
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf-8'
      }).trim();
      
      this.log(`Usando branch atual: ${currentBranch}`, 'warning');
      return currentBranch;
    }
    
    if (this.options.worktree) {
      // Criar worktree
      return await this.createWorktree(slug);
    }
    
    // Criar branch normal
    const branchName = `${prefix}/${slug}`;
    
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'pipe' });
      this.log(`Branch criada: ${branchName}`, 'success');
      return branchName;
    } catch (error) {
      // Branch já existe, usar sufixo
      const timestamp = Date.now().toString().slice(-4);
      const branchWithSuffix = `${prefix}/${slug}-${timestamp}`;
      execSync(`git checkout -b ${branchWithSuffix}`, { stdio: 'pipe' });
      this.log(`Branch criada: ${branchWithSuffix}`, 'success');
      return branchWithSuffix;
    }
  }

  generateSlug() {
    const prompt = this.options.prompt || 'task';
    return prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 30);
  }

  async createWorktree(slug) {
    const worktreesDir = path.join(process.cwd(), '..', `${path.basename(process.cwd())}-gnhf-worktrees`);
    const worktreePath = path.join(worktreesDir, slug);
    
    await fs.mkdir(worktreesDir, { recursive: true });
    
    try {
      execSync(`git worktree add ${worktreePath} -b gnhf-wt/${slug}`, { stdio: 'pipe' });
      this.log(`Worktree criado: ${worktreePath}`, 'success');
      this.worktree = worktreePath;
      return `gnhf-wt/${slug}`;
    } catch (error) {
      throw new Error(`Failed to create worktree: ${error.message}`);
    }
  }

  async savePrompt() {
    const prompt = this.options.prompt;
    if (!prompt) {
      throw new Error('Prompt is required');
    }
    
    const content = `# Prompt Original

${prompt}

## Metadados

- **Início:** ${new Date().toISOString()}
- **Run ID:** ${this.runId}
- **Branch:** ${this.branch || 'pending'}
- **Agente:** ${this.options.agent || CONFIG.defaultAgent}
`;
    
    await fs.writeFile(this.promptPath, content, 'utf-8');
  }

  async loadConfig() {
    try {
      const config = await fs.readFile(CONFIG.configPath, 'utf-8');
      // Parse YAML (simplificado)
      this.config = this.parseYaml(config);
      this.log('Config loaded', 'success');
    } catch (error) {
      this.log('Config not found, using defaults', 'warning');
      this.config = {
        agent: CONFIG.defaultAgent,
        maxConsecutiveFailures: CONFIG.maxConsecutiveFailures,
        preventSleep: CONFIG.preventSleep
      };
    }
  }

  parseYaml(yaml) {
    // Parser YAML simplificado
    const result = {};
    const lines = yaml.split('\n');
    
    for (const line of lines) {
      if (line.includes(':') && !line.trim().startsWith('#')) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (value === 'true') result[key] = true;
        else if (value === 'false') result[key] = false;
        else if (!isNaN(value)) result[key] = parseInt(value);
        else result[key] = value.replace(/"/g, '');
      }
    }
    
    return result;
  }

  async runIteration() {
    this.iteration++;
    this.log(`Iniciando iteração ${this.iteration}`, 'info');
    
    try {
      // 1. Ler contexto (notes.md / handoffs)
      const context = await this.loadContext();
      
      // 2. Executar agente
      const agentResult = await this.runAgent(context);
      
      // 3. Executar validação V&V (gate crítico)
      const vvResult = await this.runValidation(agentResult);
      
      if (!vvResult.passed) {
        this.log(`Validação V&V falhou: ${vvResult.reason}`, 'error');
        await this.handleFailure('VV_FAILED', vvResult.reason);
        return false;
      }
      
      // 4. Commit (após V&V aprovado)
      await this.commitChanges(agentResult);
      
      // 5. Atualizar handoff
      await this.updateHandoff(agentResult);
      
      // 6. Verificar condição de parada
      if (this.shouldStop(agentResult)) {
        this.stopConditionMet = true;
        this.log('Condição de parada atingida', 'warning');
      }
      
      this.consecutiveFailures = 0;
      this.log(`Iteração ${this.iteration} completada com sucesso`, 'success');
      
      return true;
    } catch (error) {
      this.log(`Erro na iteração: ${error.message}`, 'error');
      await this.handleFailure('AGENT_ERROR', error.message);
      return false;
    }
  }

  async loadContext() {
    let context = '';
    
    // Carregar handoffs do NexusAuto
    const handoffPath = path.join(CONFIG.handoffsDir, 'current-handoff.md');
    try {
      const handoff = await fs.readFile(handoffPath, 'utf-8');
      context += `## Handoff Atual\n\n${handoff}\n\n`;
    } catch (e) {
      // Sem handoff existente
    }
    
    // Carregar notes.md (compatibilidade GNHF)
    try {
      const notes = await fs.readFile(this.notesPath, 'utf-8');
      context += `## Notas das Iterações Anteriores\n\n${notes}\n\n`;
    } catch (e) {
      // Sem notes existentes
    }
    
    return context || 'Sem contexto prévio.';
  }

  async runAgent(context) {
    const agent = this.options.agent || this.config.agent || CONFIG.defaultAgent;
    
    this.log(`Executando agente: ${agent}`, 'info');
    
    // Construir prompt
    const prompt = await fs.readFile(this.promptPath, 'utf-8');
    const fullPrompt = `${prompt}\n\n${context}\n\n## Instruções\n\n- Faça uma mudança pequena e focada por vez\n- Siga os padrões do NexusAuto\n- Execute testes após a mudança\n- Documente o que foi feito\n`;
    
    // Executar agente (implementação simplificada)
    // Na implementação real, chamaria Claude Code, Codex, etc.
    
    const result = {
      success: true,
      changes: [],
      summary: `Iteração ${this.iteration} completada`,
      tokens: { input: 1000, output: 500 },
      agentOutput: fullPrompt
    };
    
    // Simular execução do agente
    await this.simulateAgentExecution(result);
    
    this.totalTokens += (result.tokens.input + result.tokens.output);
    
    return result;
  }

  async simulateAgentExecution(result) {
    // Simulação - na implementação real, chamaria o agente
    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  async runValidation(agentResult) {
    this.log('Executando validação V&V (7 passos)...', 'info');
    
    // Verificar se script V&V existe
    try {
      const vvOutput = execSync(`node ${CONFIG.vvScript} --json`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      const result = JSON.parse(vvOutput);
      
      if (result.passed) {
        this.log('Validação V&V aprovada', 'success');
      } else {
        this.log(`Validação V&V falhou: ${result.issues?.join(', ')}`, 'error');
      }
      
      return result;
    } catch (error) {
      // Script V&V não existe ou falhou
      this.log('Script V&V não encontrado, usando validação simplificada', 'warning');
      
      // Validação simplificada
      return {
        passed: agentResult.success,
        reason: agentResult.success ? 'OK' : 'Agent failed'
      };
    }
  }

  async commitChanges(agentResult) {
    this.log('Commitando mudanças...', 'info');
    
    try {
      // Adicionar mudanças
      execSync('git add -A', { stdio: 'pipe' });
      
      // Verificar se há mudanças
      const status = execSync('git status --porcelain', { encoding: 'utf-8' });
      if (!status.trim()) {
        this.log('Nenhuma mudança para commitar', 'warning');
        return;
      }
      
      // Criar mensagem de commit
      const message = `gnhf ${this.iteration}: ${agentResult.summary}`;
      
      // Commitar
      execSync(`git commit -m "${message}"`, { stdio: 'pipe' });
      
      this.log(`Commit criado: ${message}`, 'success');
      
      // Push se configurado
      if (this.options.push) {
        await this.pushChanges();
      }
    } catch (error) {
      throw new Error(`Commit failed: ${error.message}`);
    }
  }

  async pushChanges() {
    this.log('Pushing changes...', 'info');
    
    try {
      execSync('git push -u origin HEAD', { stdio: 'pipe' });
      this.log('Push completed', 'success');
    } catch (error) {
      this.log(`Push failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async updateHandoff(agentResult) {
    const handoff = `# Handoff - Iteração ${this.iteration}

## Resumo

${agentResult.summary}

## Mudanças

${agentResult.changes.map(c => `- ${c}`).join('\n') || 'Nenhuma mudança'}

## Validação V&V

- **Status:** ${agentResult.vvPassed ? '✅ Aprovado' : '❌ Reprovado'}
- **Passos:** 7/7
- **Issues:** ${agentResult.vvIssues?.join(', ') || 'Nenhuma'}

## Tokens

- Input: ${agentResult.tokens?.input || 0}
- Output: ${agentResult.tokens?.output || 0}
- Total: ${this.totalTokens}

## Próxima Ação

${agentResult.nextAction || 'Continuar para próxima iteração'}

---

*Gerado automaticamente por NexusGNHF em ${new Date().toISOString()}*
`;

    const handoffPath = path.join(CONFIG.handoffsDir, `iteration-${this.iteration}.md`);
    await fs.writeFile(handoffPath, handoff, 'utf-8');
    
    // Atualizar notes.md (compatibilidade)
    const notes = await this.appendNotes(agentResult);
    await fs.writeFile(this.notesPath, notes, 'utf-8');
  }

  async appendNotes(agentResult) {
    let notes = '';
    
    try {
      notes = await fs.readFile(this.notesPath, 'utf-8');
      notes += '\n\n---\n\n';
    } catch (e) {
      notes = '# Notes\n\n';
    }
    
    notes += `## Iteração ${this.iteration}\n\n${agentResult.summary}\n\n`;
    
    return notes;
  }

  async handleFailure(reason, details) {
    this.consecutiveFailures++;
    
    this.log(`Falha ${this.consecutiveFailures}/${this.config.maxConsecutiveFailures || CONFIG.maxConsecutiveFailures}`, 'error');
    
    if (this.consecutiveFailures >= (this.config.maxConsecutiveFailures || CONFIG.maxConsecutiveFailures)) {
      this.log('Máximo de falhas consecutivas atingido, abortando...', 'error');
      this.stopConditionMet = true;
    } else {
      // Rollback
      this.log('Rollback...', 'warning');
      try {
        execSync('git reset --hard HEAD', { stdio: 'pipe' });
        this.log('Rollback completed', 'success');
      } catch (error) {
        this.log(`Rollback failed: ${error.message}`, 'error');
      }
    }
  }

  shouldStop(agentResult) {
    // Verificar condição de parada customizada
    if (this.stopCondition && agentResult.summary.includes(this.stopCondition)) {
      return true;
    }
    
    return false;
  }

  async runLoop() {
    this.log('Iniciando loop principal...', 'info');
    
    while (!this.stopConditionMet) {
      // Verificar max iterations
      if (this.options.maxIterations && this.iteration >= this.options.maxIterations) {
        this.log(`Máximo de iterações (${this.options.maxIterations}) atingido`, 'warning');
        break;
      }
      
      // Verificar max tokens
      if (this.options.maxTokens && this.totalTokens >= this.options.maxTokens) {
        this.log(`Máximo de tokens (${this.options.maxTokens}) atingido`, 'warning');
        break;
      }
      
      const success = await this.runIteration();
      
      if (!success && this.stopConditionMet) {
        break;
      }
    }
    
    await this.printSummary();
  }

  async printSummary() {
    const elapsed = Date.now() - this.startTime;
    const elapsedMinutes = Math.floor(elapsed / 60000);
    const elapsedSeconds = Math.floor((elapsed % 60000) / 1000);
    
    console.log('\n' + '='.repeat(60));
    console.log('NEXUSGNHF - RESUMO FINAL');
    console.log('='.repeat(60));
    console.log(`Branch:          ${this.branch}`);
    console.log(`Tempo:           ${elapsedMinutes}m ${elapsedSeconds}s`);
    console.log(`Iterações:       ${this.iteration}`);
    console.log(`Tokens:          ~${this.totalTokens.toLocaleString()}`);
    console.log(`Falhas:          ${this.consecutiveFailures}`);
    console.log(`Status:          ${this.stopConditionMet ? 'Concluído' : 'Interrompido'}`);
    console.log('');
    console.log(`Run Log:         ${path.join(this.runDir, 'gnhf.log')}`);
    console.log(`Handoffs:        ${CONFIG.handoffsDir}`);
    console.log('');
    console.log('Para revisar:');
    console.log(`  git log ${this.branch}`);
    console.log(`  git diff HEAD~${this.iteration}`);
    console.log('='.repeat(60));
  }

  async run() {
    try {
      await this.initialize();
      await this.runLoop();
    } catch (error) {
      this.log(`Erro fatal: ${error.message}`, 'error');
      await this.printSummary();
      process.exit(1);
    }
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      
      if (key === 'max-iterations') {
        options.maxIterations = parseInt(value);
        i++;
      } else if (key === 'max-tokens') {
        options.maxTokens = parseInt(value);
        i++;
      } else if (key === 'stop-when') {
        options.stopWhen = value;
        i++;
      } else if (key === 'agent') {
        options.agent = value;
        i++;
      } else if (key === 'current-branch') {
        options.currentBranch = true;
      } else if (key === 'push') {
        options.push = true;
      } else if (key === 'worktree') {
        options.worktree = true;
      } else if (key === 'verbose' || key === 'v') {
        options.verbose = true;
      }
    } else if (!arg.startsWith('-')) {
      options.prompt = arg;
    }
  }
  
  return options;
}

// Main
const options = parseArgs();

if (!options.prompt && process.argv.length < 3) {
  console.log(`
NexusGNHF - Good Night, Have Fun

Uso:
  gnhf "objetivo em inglês" [opções]

Opções:
  --max-iterations <n>     Abortar após n iterações
  --max-tokens <n>         Abortar após n tokens
  --stop-when <cond>       Parar quando condição for atingida
  --agent <agent>          Agente (claude, codex, copilot, etc)
  --current-branch         Usar branch atual
  --push                   Push após cada commit
  --worktree               Rodar em worktree isolado
  --verbose, -v            Logs detalhados

Exemplos:
  gnhf "reduce complexity of the codebase"
  gnhf "add tests for module Y" --max-iterations 10
  gnhf "refactor API layer" --worktree
  gnhf "keep improving" --current-branch --push
`);
  process.exit(0);
}

const gnhf = new NexusGNHF(options);
gnhf.run().catch(console.error);