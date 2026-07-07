import fs from 'fs';
import path from 'path';

export class Reporter {
  private baseDir: string;
  private logs: string[] = [];

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  log(message: string) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${message}`;
    console.log(formatted);
    this.logs.push(formatted);
  }

  async generateSummary() {
    const logDir = path.join(this.baseDir, '.gnhf-logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const summaryPath = path.join(logDir, 'summary.md');
    const content = `# GNHF Execution Summary\n\n## Logs\n\`\`\`\n${this.logs.join('\n')}\n\`\`\`\n`;
    
    fs.writeFileSync(summaryPath, content);
    console.log(`📝 Sumário gerado em ${summaryPath}`);
  }
}
