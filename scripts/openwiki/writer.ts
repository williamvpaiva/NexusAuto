import fs from 'fs';
import path from 'path';
import { GeneratedDocs } from './llm';

export async function writeDocs(rootDir: string, docs: GeneratedDocs) {
  const agentsPath = path.join(rootDir, 'AGENTS.md');
  const claudePath = path.join(rootDir, 'CLAUDE.md');

  fs.writeFileSync(agentsPath, docs.agents);
  fs.writeFileSync(claudePath, docs.claude);
}
