import { GitManager } from './gitManager';
import { Reporter } from './reporter';
import { AgentAdapter, DummyAgentAdapter } from './agentAdapter';

export class ExecutionLoop {
  private git: GitManager;
  private reporter: Reporter;
  private agent: AgentAdapter;

  constructor(git: GitManager, reporter: Reporter) {
    this.git = git;
    this.reporter = reporter;
    this.agent = new DummyAgentAdapter(); // default to dummy for now
  }

  async run(task: string, maxRetries = 3) {
    let attempt = 1;

    while (attempt <= maxRetries) {
      this.reporter.log(`Tentativa ${attempt} de ${maxRetries} para a tarefa: ${task}`);
      
      const result = await this.agent.execute(task);
      
      if (result.success) {
        // Run tests/linting (simulated Quality Gate 1)
        const passesGates = await this.checkQualityGates();
        
        if (passesGates) {
          await this.git.commit(`GNHF(task): ${task}`);
          this.reporter.log(`✅ Sucesso na tentativa ${attempt}. Commit realizado.`);
          await this.reporter.generateSummary();
          return;
        } else {
          this.reporter.log(`❌ Quality Gate falhou na tentativa ${attempt}. Revertendo...`);
          await this.git.revertHard();
        }
      } else {
        this.reporter.log(`⚠️ Agente falhou na tentativa ${attempt}: ${result.message}`);
      }

      attempt++;
    }

    this.reporter.log(`⛔ Falha após ${maxRetries} tentativas.`);
    await this.reporter.generateSummary();
  }

  private async checkQualityGates(): Promise<boolean> {
    // Aqui viriam chamadas reais a `npm run test` e `npm run lint`
    console.log('🛡️ Verificando Quality Gates...');
    return true; // Simula sucesso sempre
  }
}
