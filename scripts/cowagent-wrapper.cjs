const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const COWAGENT_DIR = path.join(__dirname, '..', 'cowagent');
const VENV_PYTHON = process.platform === 'win32' 
  ? path.join(COWAGENT_DIR, 'venv', 'Scripts', 'python.exe')
  : path.join(COWAGENT_DIR, 'venv', 'bin', 'python');
const COW_SCRIPT = path.join(COWAGENT_DIR, 'cli', 'cli.py');
const SETUP_SCRIPT = process.platform === 'win32'
  ? path.join(__dirname, 'setup-cowagent.bat')
  : path.join(__dirname, 'setup-cowagent.sh');

class CowAgentWrapper {
  constructor() {
    this.ready = false;
    this.checkEnvironment();
  }

  // Verifica se o CowAgent está instalado e prepara o ambiente
  checkEnvironment() {
    if (!fs.existsSync(COWAGENT_DIR)) {
      throw new Error(`CowAgent não encontrado em ${COWAGENT_DIR}. Execute 'git submodule update --init' primeiro.`);
    }
    // Verifica se o virtualenv existe; se não, executa setup
    if (!fs.existsSync(VENV_PYTHON)) {
      console.log('⚙️ Configurando ambiente CowAgent...');
      if (process.platform === 'win32') {
        execSync(`cmd.exe /c "${SETUP_SCRIPT}"`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
      } else {
        execSync(`bash "${SETUP_SCRIPT}"`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
      }
    }
    this.ready = true;
  }

  // Executa um comando do CowAgent via CLI
  executeCommand(command, args = {}) {
    if (!this.ready) throw new Error('CowAgent não está pronto.');

    const cmdArgs = Object.entries(args)
      .map(([k, v]) => `--${k} "${v}"`)
      .join(' ');

    const fullCmd = `"${VENV_PYTHON}" -m cli ${command} ${cmdArgs}`;
    console.log(`🐄 Executando CowAgent: ${fullCmd}`);

    const env = {
      ...process.env,
      COWAGENT_MEMORY_DB: path.join(__dirname, '..', 'nexusauto_memory.db'),
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1'
    };

    return new Promise((resolve, reject) => {
      exec(fullCmd, { maxBuffer: 10 * 1024 * 1024, env, cwd: COWAGENT_DIR }, (error, stdout, stderr) => {
        if (error) {
          reject({ error: error.message, stdout, stderr });
        } else {
          // Tenta parsear a saída como JSON (se possível)
          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch {
            resolve({ output: stdout, stderr });
          }
        }
      });
    });
  }

  // Método específico: executar uma tarefa (recebe spec/plan/tasks)
  async executeTask(tasksFile, context = {}) {
    // Lê o arquivo de tasks gerado pelo Spec-Kit
    const tasksContent = fs.readFileSync(tasksFile, 'utf-8');
    // Envia para o CowAgent como um objetivo
    return this.executeCommand('plan', { 
      objective: tasksContent,
      context: JSON.stringify(context)
    });
  }

  // Método específico: consolidar memória (Deep Dream)
  async consolidateMemory() {
    return this.executeCommand('memory', { action: 'consolidate' });
  }

  // Método específico: listar skills disponíveis no CowAgent
  async listSkills() {
    const result = await this.executeCommand('skill list');
    return result.skills || result;
  }

  // Método específico: executar uma skill específica
  async executeSkill(skillName, params = {}) {
    return this.executeCommand('skill', { 
      name: skillName,
      params: JSON.stringify(params)
    });
  }

  // Método para atualizar a documentação via OpenWiki
  async runOpenWiki() {
    console.log('📚 Iniciando OpenWiki para atualizar documentação...');
    return new Promise((resolve, reject) => {
      exec('openwiki update', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro no OpenWiki: ${error.message}`);
          reject({ error: error.message, stdout, stderr });
        } else {
          console.log(stdout);
          resolve({ output: stdout, stderr });
        }
      });
    });
  }

  // Método para iniciar um loop autônomo de tarefas via GNHF
  async runGNHF(taskDescription) {
    console.log(`🌙 Iniciando GNHF para a tarefa: ${taskDescription}`);
    return new Promise((resolve, reject) => {
      exec(`gnhf start "${taskDescription}"`, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro no GNHF: ${error.message}`);
          reject({ error: error.message, stdout, stderr });
        } else {
          console.log(stdout);
          resolve({ output: stdout, stderr });
        }
      });
    });
  }

  // === DELEGAÇÃO AUTOMÁTICA ===
  
  // Matriz de roteamento baseada em palavras-chave (do TECH-LEAD.md)
  keywordRouting = {
    'arquitetura': 'architect',
    'diagrama': 'architect',
    'ADR': 'architect',
    'estrutura': 'architect',
    'API': 'backend-dev',
    'endpoint': 'backend-dev',
    'controller': 'backend-dev',
    'service': 'backend-dev',
    'componente': 'frontend-dev',
    'UI': 'frontend-dev',
    'React': 'frontend-dev',
    'frontend': 'frontend-dev',
    'vulnerabilidade': 'security',
    'OWASP': 'security',
    'pentest': 'security',
    'auth': 'security',
    'banco': 'architect',
    'query': 'backend-dev',
    'migration': 'backend-dev',
    'schema': 'architect',
    'CI': 'devops',
    'CD': 'devops',
    'deploy': 'devops',
    'pipeline': 'devops',
    'Docker': 'devops',
    'teste': 'qa-tester',
    'coverage': 'qa-tester',
    'jest': 'qa-tester',
    'playwright': 'qa-tester',
    'performance': 'performance',
    'otimização': 'performance',
    'cache': 'performance',
    'acessibilidade': 'frontend-dev',
    'WCAG': 'frontend-dev',
    'a11y': 'frontend-dev',
    'SEO': 'frontend-dev',
    'analytics': 'frontend-dev',
    'documento': 'tech-lead',
    'README': 'tech-lead',
    'onboarding': 'tech-lead',
    'limpeza': 'backend-dev',
    'dead code': 'backend-dev',
    'refatoração': 'backend-dev',
    'memória': 'tech-lead',
    'aprender': 'tech-lead',
    'contexto': 'tech-lead',
    'handoff': 'tech-lead',
    'produto digital': 'digital-product-creator',
    'ebook': 'digital-product-creator',
    'curso': 'digital-product-creator',
    'infoproduto': 'digital-product-creator',
    'precificação': 'monetization-strategist',
    'monetização': 'monetization-strategist',
    'receita': 'monetization-strategist',
    'upsell': 'monetization-strategist',
    'lançamento': 'product-launch-manager',
    'marketing': 'product-launch-manager',
    'tráfego': 'product-launch-manager',
    'venda': 'product-launch-manager'
  };

  // Analisa tarefa e determina agente responsável automaticamente
  analyzeAndDelegate(task) {
    const taskText = typeof task === 'string' ? task : task.description || task.objective || '';
    const taskLower = taskText.toLowerCase();
    
    // Contagem de keywords por agente
    const agentScores = {};
    
    for (const [keyword, agent] of Object.entries(this.keywordRouting)) {
      if (taskLower.includes(keyword.toLowerCase())) {
        agentScores[agent] = (agentScores[agent] || 0) + 1;
      }
    }
    
    // Agente com maior score
    const bestAgent = Object.entries(agentScores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'backend-dev';
    
    console.log(`🎯 Tarefa delegada automaticamente para: ${bestAgent} (score: ${agentScores[bestAgent] || 1})`);
    
    // Delega para o agente apropriado
    return this.delegateToAgent(bestAgent, task);
  }

  // Delega tarefa para agente específico
  async delegateToAgent(agentName, task) {
    const taskText = typeof task === 'string' ? task : JSON.stringify(task);
    
    // Mapeia agente para skill do CowAgent
    const skillMap = {
      'architect': 'architecture-design',
      'backend-dev': 'backend-development',
      'frontend-dev': 'frontend-development',
      'security': 'security-audit',
      'devops': 'ci-cd-pipeline',
      'qa-tester': 'test-generation',
      'performance': 'performance-optimization',
      'tech-lead': 'code-review',
      'digital-product-creator': 'digital-product-create',
      'monetization-strategist': 'monetization-plan',
      'product-launch-manager': 'launch-plan'
    };
    
    const skillName = skillMap[agentName] || 'general-task';
    
    console.log(`📋 Delegando para ${agentName} usando skill: ${skillName}`);
    
    return this.executeSkill(skillName, {
      task: taskText,
      agent: agentName,
      timestamp: new Date().toISOString()
    });
  }

  // Executa tarefa com delegação automática e monitoramento
  async executeTaskWithAutoDelegation(tasksFile, options = {}) {
    const { 
      enableAutoDelegate = true, 
      monitorProgress = true,
      timeout = 300000 // 5 minutos default
    } = options;
    
    // Lê tasks do arquivo
    const tasksContent = fs.readFileSync(tasksFile, 'utf-8');
    const tasks = tasksContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    const results = [];
    
    for (const task of tasks) {
      if (!task.includes('- [ ]') && !task.includes('- [x]')) continue;
      
      const taskDesc = task.replace(/- \[.\]\s*/, '').trim();
      
      try {
        let result;
        
        if (enableAutoDelegate) {
          console.log(`🔄 Analisando tarefa: ${taskDesc.substring(0, 50)}...`);
          result = await this.analyzeAndDelegate(taskDesc);
        } else {
          result = await this.executeTask(taskDesc);
        }
        
        results.push({
          task: taskDesc,
          status: 'completed',
          result,
          timestamp: new Date().toISOString()
        });
        
        if (monitorProgress) {
          console.log(`✅ Tarefa concluída: ${taskDesc.substring(0, 50)}...`);
        }
        
      } catch (error) {
        results.push({
          task: taskDesc,
          status: 'failed',
          error: error.error || error.message,
          timestamp: new Date().toISOString()
        });
        
        if (monitorProgress) {
          console.error(`❌ Tarefa falhou: ${taskDesc.substring(0, 50)}...`);
          console.error(`   Erro: ${error.error || error.message}`);
        }
      }
    }
    
    return {
      total: tasks.length,
      completed: results.filter(r => r.status === 'completed').length,
      failed: results.filter(r => r.status === 'failed').length,
      results
    };
  }
}

module.exports = CowAgentWrapper;
