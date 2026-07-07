#!/usr/bin/env ts-node
import { Command } from 'commander';
import { initConfig } from './config';
import { scanRepo } from './scanner';
import { generateDocs } from './llm';
import { writeDocs } from './writer';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.openwiki') });

const program = new Command();

program
  .name('openwiki')
  .description('Ferramenta para manter a documentação do projeto atualizada automaticamente usando LLMs.')
  .version('1.0.0');

program
  .command('init')
  .description('Configura as chaves de API e preferências locais')
  .action(async () => {
    await initConfig();
  });

program
  .command('update')
  .description('Lê o repositório e atualiza a documentação (AGENTS.md, CLAUDE.md)')
  .action(async () => {
    console.log('🔍 Escaneando repositório...');
    const context = await scanRepo(process.cwd());
    console.log('🤖 Gerando documentação com LLM...');
    const docs = await generateDocs(context);
    console.log('📝 Escrevendo arquivos...');
    await writeDocs(process.cwd(), docs);
    console.log('✅ Documentação atualizada com sucesso!');
  });

program.parse();
