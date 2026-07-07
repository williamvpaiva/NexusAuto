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
}

module.exports = CowAgentWrapper;
