import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

export interface AgentResult {
  success: boolean;
  message: string;
}

export interface AgentAdapter {
  execute(task: string): Promise<AgentResult>;
}

export class RealLLMAgentAdapter implements AgentAdapter {
  async execute(task: string): Promise<AgentResult> {
    console.log(`🤖 [RealLLMAgent] Conectando à "The Agency" via GPT-4o para a tarefa: ${task}...`);
    try {
      const llm = new ChatOpenAI({
        modelName: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        apiKey: process.env.GROQ_API_KEY,
        configuration: {
          baseURL: "https://api.groq.com/openai/v1"
        }
      });

      const prompt = PromptTemplate.fromTemplate(`
Você é um agente autônomo (backend/devops) da "The Agency".
Sua missão: {task}

Analise a missão e decida como resolver. Como você é o cérebro operando via script, retorne a sua conclusão neste exato formato JSON (sem blocos de markdown e sem crases):
{{
  "success": true,
  "message": "Uma string curta dizendo que você compreendeu, e listando brevemente as estratégias."
}}
Se não conseguir resolver, retorne "success": false.
`);

      const chain = RunnableSequence.from([
        prompt,
        llm,
        new StringOutputParser(),
      ]);

      const resultString = await chain.invoke({ task });
      
      const cleanResult = resultString.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsedResult = JSON.parse(cleanResult);
      
      console.log(`🤖 [RealLLMAgent] Diagnóstico da IA:\n${parsedResult.message}`);
      
      return {
        success: parsedResult.success,
        message: parsedResult.message
      };
    } catch (err: any) {
      console.error(`❌ [RealLLMAgent] Falha de comunicação com a LLM:`, err.message);
      return { success: false, message: err.message };
    }
  }
}

export class DummyAgentAdapter implements AgentAdapter {
  async execute(task: string): Promise<AgentResult> {
    console.log(`🤖 [DummyAgent] Trabalhando na tarefa: ${task}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`🤖 [DummyAgent] Trabalho concluído!`);
    return { success: true, message: 'Dummy task executed successfully.' };
  }
}
