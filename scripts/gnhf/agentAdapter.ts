export interface AgentResult {
  success: boolean;
  message: string;
}

export interface AgentAdapter {
  execute(task: string): Promise<AgentResult>;
}

export class DummyAgentAdapter implements AgentAdapter {
  async execute(task: string): Promise<AgentResult> {
    console.log(`🤖 [DummyAgent] Trabalhando na tarefa: ${task}...`);
    // Simula trabalho assíncrono
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`🤖 [DummyAgent] Trabalho concluído!`);
    return { success: true, message: 'Dummy task executed successfully.' };
  }
}
