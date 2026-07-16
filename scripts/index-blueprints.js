const MemoryManager = require('./memory-manager');
const fs = require('fs');
const path = require('path');

async function indexBlueprints() {
  const mm = new MemoryManager();
  await mm.init();

  const blueprintsDir = path.join(__dirname, '..', '.ai-factory', 'blueprints', 'awesome-llm-apps');
  
  if (!fs.existsSync(blueprintsDir)) {
    console.error(`Diretório de blueprints não encontrado: ${blueprintsDir}`);
    process.exit(1);
  }

  const dirsToIndex = [
    'advanced_ai_agents', 'advanced_llm_apps', 'agent_skills', 
    'always_on_agents', 'generative_ui_agents', 'mcp_ai_agents', 
    'rag_tutorials', 'starter_ai_agents', 'voice_ai_agents'
  ];

  for (const dir of dirsToIndex) {
    const fullPath = path.join(blueprintsDir, dir);
    if (fs.existsSync(fullPath)) {
      const subdirs = fs.readdirSync(fullPath).filter(f => fs.statSync(path.join(fullPath, f)).isDirectory());
      
      for (const app of subdirs) {
        const appPath = path.join(fullPath, app);
        let description = `Blueprint Application: ${app} in category ${dir}. `;
        
        const readmePath = path.join(appPath, 'README.md');
        if (fs.existsSync(readmePath)) {
          const readmeContent = fs.readFileSync(readmePath, 'utf8').substring(0, 500);
          description += `\nResumo do README:\n${readmeContent}...`;
        } else {
          description += `\n(Sem README disponível. Analisar o código fonte no caminho .ai-factory/blueprints/awesome-llm-apps/${dir}/${app})`;
        }

        console.log(`Indexando blueprint: ${dir}/${app}...`);
        
        await mm.saveMemory(description, { 
          agent: 'architect', 
          type: 'blueprint', 
          tags: ['llm-app', dir, app, 'reference'] 
        });
      }
    }
  }

  await mm.close();
  console.log('Indexação de Blueprints concluída com sucesso!');
}

indexBlueprints().catch(err => {
  console.error(err);
  process.exit(1);
});
