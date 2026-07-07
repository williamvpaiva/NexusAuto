import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

export async function initConfig() {
  console.log('Bem-vindo ao OpenWiki Configuração!\n');
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'OPENAI_API_KEY',
      message: 'Insira sua OPENAI_API_KEY (ou pressione enter para pular):',
    },
    {
      type: 'confirm',
      name: 'enableLangSmith',
      message: 'Deseja habilitar o LangSmith para tracing?',
      default: false,
    },
    {
      type: 'input',
      name: 'LANGCHAIN_API_KEY',
      message: 'Insira sua LANGCHAIN_API_KEY:',
      when: (answers) => answers.enableLangSmith,
    },
  ]);

  let envContent = '';
  if (answers.OPENAI_API_KEY) {
    envContent += `OPENAI_API_KEY=${answers.OPENAI_API_KEY}\n`;
  }
  if (answers.enableLangSmith) {
    envContent += `LANGCHAIN_TRACING_V2=true\n`;
    envContent += `LANGCHAIN_API_KEY=${answers.LANGCHAIN_API_KEY}\n`;
    envContent += `LANGCHAIN_PROJECT=openwiki\n`;
  }

  const envPath = path.join(process.cwd(), '.env.openwiki');
  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Configuração salva em ${envPath}`);
}
