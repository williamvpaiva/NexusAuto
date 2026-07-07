import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

export interface GeneratedDocs {
  agents: string;
  claude: string;
}

export async function generateDocs(repoContext: string): Promise<GeneratedDocs> {
  const llm = new ChatOpenAI({
    modelName: 'gpt-4o', // Can be configured
    temperature: 0.1,
  });

  const prompt = PromptTemplate.fromTemplate(`
You are a technical documentation AI.
Based on the following repository context, generate the contents for two files:
1. AGENTS.md: A guide for AI agents interacting with this repo. Include architecture overview, rules, and commands.
2. CLAUDE.md: A summary file specifically tailored for Claude with quick tips on how to build and test this project.

Return the response in this EXACT JSON format:
{{
  "agents": "# AGENTS.md content here...",
  "claude": "# CLAUDE.md content here..."
}}

Repository Context:
{context}
`);

  const chain = RunnableSequence.from([
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke({ context: repoContext });
  
  try {
    // Sometimes LLMs wrap JSON in markdown blocks
    const cleanResult = result.replace(/^```json/m, '').replace(/```$/m, '').trim();
    return JSON.parse(cleanResult) as GeneratedDocs;
  } catch (error) {
    console.error("Failed to parse LLM response. Fallback to raw text.");
    return { agents: result, claude: result };
  }
}
