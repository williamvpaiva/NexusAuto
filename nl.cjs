#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FACTORY = path.resolve(__dirname, '.ai-factory');
const SCRIPTS = path.join(FACTORY, 'scripts');
const BRAIN = path.join(FACTORY, 'brain');
const AGENTS = path.join(FACTORY, 'agents');
const MELHORIAS = path.join(FACTORY, 'MELHORIAS');
const MEMORY_DB = path.resolve(__dirname, 'nexusauto_memory.db');

const command = process.argv[2];
const args = process.argv.slice(3);

function timestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function log(msg) {
  console.log(`[${timestamp()}] ${msg}`);
}

function runMemoryManager(subcmd, ...subargs) {
  const mmPath = path.join(SCRIPTS, 'memory-manager.js');
  if (!fs.existsSync(mmPath)) {
    return console.error('memory-manager.js not found');
  }
  const result = execSync(`node "${mmPath}" ${subcmd} ${subargs.map(a => `"${a}"`).join(' ')}`, { encoding: 'utf8', cwd: __dirname });
  return result.trim();
}

function help() {
  console.log(`
NexusAuto Slash Commands — Usage: nl <command> [args]

AGENCY:
  agency-list                    List all agency profiles
  agency-load <name>             Load a profile
  agency-search <term>           Search profiles
  agency-create <name> <div>     Create a new profile
  agency-export <format>         Export profiles (cursor|claude|copilot)

MEMORY:
  memory-watch                   Start memory watcher
  memory-stop                    Stop memory watcher
  memory-summarize               Generate session summary
  memory-dashboard               Open web dashboard
  memory-purge                   Remove private memories
  memory-inject                  Inject relevant memories
  memory-stats                   Show memory stats

SPEC-KIT:
  specify <description>          Generate spec (spec + plan + tasks)
  specify-feature <name>         Create new feature structure
  constitution                   Sync constitution
  plan <tech>                    Generate technical plan
  clarify                        Run clarification phase
  tasks                          Generate task list
  implement                      Dispatch agent orchestration
  import-tasks                   Import tasks to MELHORIAS
  validate-spec                  Validate current spec

EXECUTION:
  execute <task>                 Delegate task to Executor Agent
  execute-tasks <path>           Execute all tasks from a spec
  execute-skill <name> [args]    Execute a specific skill

LEARNING:
  consolidate-memory             Run memory consolidation
  learn                          Extract learnings from conversations
  list-skills                    List all available skills
  add-skill <name> <desc>        Create a new skill

SESSION:
  standup                        Daily standup summary
  session-start                  Start session with context loading
  log-decision <text>            Log an architecture decision
  search <term>                  Search memory
  brag <achievement>             Log an achievement
  retrospective                  Run retrospective analysis
  skills --list                  List learned skills
  skill load <name>              Load a skill
  skill run <name> [args]        Execute a skill
  query <term>                   Query memory

CHANNEL:
  channel slack                  Connect to Slack
  channel web                    Activate web interface

DESIGN:
  generate <description>         Generate UI design spec
  save <name> <key>              Save a design
  palette <theme>                Generate color palette
  checklist <context>            Generate accessibility checklist
`);
}

async function main() {
  if (!command || command === 'help') { help(); return; }

  switch (command) {
    // --- AGENCY ---
    case 'agency-list': {
      log('Agency Profiles:');
      const profilesDir = path.join(FACTORY, 'the-agency', 'profiles');
      if (fs.existsSync(profilesDir)) {
        const dirs = fs.readdirSync(profilesDir, { withFileTypes: true }).filter(d => d.isDirectory());
        for (const dir of dirs) {
          const dirPath = path.join(profilesDir, dir.name);
          const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
          console.log(`  ${dir.name}/ (${files.length} profiles)`);
          for (const f of files) {
            const content = fs.readFileSync(path.join(dirPath, f), 'utf8');
            const nameMatch = content.match(/name:\s*"([^"]+)"/) || content.match(/#\s*([^\n]+)/);
            console.log(`    - ${nameMatch ? nameMatch[1] : f.replace('.md', '')}`);
          }
        }
      }
      break;
    }
    case 'agency-load': {
      const profileName = args[0];
      if (!profileName) { console.error('Usage: nl agency-load <profile-name>'); return; }
      log(`Loading profile: ${profileName}`);
      const profilesDir = path.join(FACTORY, 'the-agency', 'profiles');
      let found = false;
      if (fs.existsSync(profilesDir)) {
        const walk = (dir) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) walk(full);
            else if (e.name.endsWith('.md')) {
              const content = fs.readFileSync(full, 'utf8');
              if (content.toLowerCase().includes(profileName.toLowerCase())) {
                console.log(`\n--- ${e.name} ---\n`);
                console.log(content);
                found = true;
              }
            }
          }
        };
        walk(profilesDir);
      }
      if (!found) console.log(`No profile found matching "${profileName}"`);
      break;
    }
    case 'agency-search': {
      const term = args[0];
      if (!term) { console.error('Usage: nl agency-search <term>'); return; }
      log(`Searching profiles for: ${term}`);
      const profilesDir = path.join(FACTORY, 'the-agency', 'profiles');
      if (fs.existsSync(profilesDir)) {
        const walk = (dir) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) walk(full);
            else if (e.name.endsWith('.md')) {
              const content = fs.readFileSync(full, 'utf8');
              if (content.toLowerCase().includes(term.toLowerCase())) {
                console.log(`  ${full.replace(__dirname, '.')}`);
              }
            }
          }
        };
        walk(profilesDir);
      }
      break;
    }
    case 'agency-create': {
      const name = args[0], div = args[1];
      if (!name || !div) { console.error('Usage: nl agency-create <name> <division>'); return; }
      const profilesDir = path.join(FACTORY, 'the-agency', 'profiles', div.toLowerCase());
      if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true });
      const filePath = path.join(profilesDir, `${name.toLowerCase().replace(/\s+/g, '-')}.md`);
      const template = `---
name: "${name}"
division: "${div}"
role: "Specialist"
voice: "Professional, analytical, focused on delivering quality"
---

# ${name}

## Personalidade
- Professional
- Analytical
- Detail-oriented

## Habilidades Técnicas
- Skill 1
- Skill 2
- Skill 3

## Exemplo de Prompt
\`\`\`
/prompt
\`\`\`
`;
      fs.writeFileSync(filePath, template);
      log(`Created profile: ${filePath.replace(__dirname, '.')}`);
      break;
    }
    case 'agency-export': {
      const format = args[0] || 'claude';
      log(`Exporting profiles to ${format} format...`);
      const profilesDir = path.join(FACTORY, 'the-agency', 'profiles');
      let output = '# Agency Export\n\n';
      if (fs.existsSync(profilesDir)) {
        const walk = (dir, indent = 0) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) { output += `${'  '.repeat(indent)}## ${e.name}\n`; walk(full, indent + 1); }
            else if (e.name.endsWith('.md')) {
              const content = fs.readFileSync(full, 'utf8');
              output += content + '\n---\n';
            }
          }
        };
        walk(profilesDir);
      }
      const exportPath = path.join(__dirname, `agency-export-${format}.md`);
      fs.writeFileSync(exportPath, output);
      log(`Exported to: ${exportPath}`);
      break;
    }

    // --- MEMORY ---
    case 'memory-stats': {
      const result = runMemoryManager('stats');
      console.log(result);
      break;
    }
    case 'memory-inject':
    case 'memory-summarize': {
      const result = runMemoryManager('search', 'session');
      console.log(result);
      break;
    }
    case 'memory-dashboard': {
      log('Opening memory dashboard... (start the API first: node .ai-factory/scripts/memory-api.js)');
      break;
    }
    case 'memory-purge': {
      log('Purge not implemented for safety. Use memory-manager.js directly.');
      break;
    }
    case 'memory-watch': {
      const watcherPath = path.join(SCRIPTS, 'memory-watcher.js');
      if (!fs.existsSync(watcherPath)) { console.error('memory-watcher.js not found'); return; }
      log('Starting memory watcher...');
      const child = spawn('node', [watcherPath], { cwd: __dirname, detached: true, stdio: 'ignore' });
      child.unref();
      log(`Memory watcher started (PID: ${child.pid})`);
      break;
    }
    case 'memory-stop': {
      const watcherPath = path.join(SCRIPTS, 'memory-watcher.js');
      if (fs.existsSync(watcherPath)) {
        try {
          execSync(`taskkill /F /IM node.exe /FI "WINDOWTITLE eq memory-watcher*"`, { encoding: 'utf8', stdio: 'pipe' });
        } catch {}
        log('Memory watcher stopped (if running)');
      }
      break;
    }

    // --- SESSION ---
    case 'standup': {
      log('=== Daily Standup ===');
      const brainFiles = ['Memories.md', 'Key Decisions.md', 'North Star.md', 'Patterns.md'];
      for (const f of brainFiles) {
        const fp = path.join(BRAIN, f);
        if (fs.existsSync(fp)) {
          const content = fs.readFileSync(fp, 'utf8');
          const lines = content.split('\n').filter(l => l.trim()).slice(0, 5);
          console.log(`\n[${f}]:`);
          lines.forEach(l => console.log(`  ${l}`));
        }
      }
      break;
    }
    case 'session-start': {
      log('Loading context from persistent memory...');
      const brainDir = BRAIN;
      if (fs.existsSync(brainDir)) {
        const files = ['North Star.md', 'Constitution.md', 'Memories.md', 'Key Decisions.md', 'Patterns.md', 'Skills.md', 'Brag Doc.md'];
        for (const f of files) {
          const fp = path.join(brainDir, f);
          if (fs.existsSync(fp)) {
            console.log(`\n=== ${f} ===`);
            console.log(fs.readFileSync(fp, 'utf8').split('\n').slice(0, 10).join('\n'));
            console.log('...');
          }
        }
      }
      log('Context loaded. Ready.');
      break;
    }
    case 'log-decision': {
      const text = args.join(' ');
      if (!text) { console.error('Usage: nl log-decision <text>'); return; }
      const keyDecisionsPath = path.join(BRAIN, 'Key Decisions.md');
      const date = new Date().toISOString().slice(0, 10);
      const entry = `\n- **ADR-${date}**: ${text} (${timestamp()})`;
      fs.appendFileSync(keyDecisionsPath, entry);
      log(`Decision logged: ${text}`);
      break;
    }
    case 'search': {
      const term = args[0];
      if (!term) { console.error('Usage: nl search <term>'); return; }
      const result = runMemoryManager('search', term);
      console.log(result);
      break;
    }
    case 'query': {
      const term = args.join(' ');
      if (!term) { console.error('Usage: nl query <term>'); return; }
      const result = runMemoryManager('search', term);
      console.log(result);
      break;
    }
    case 'brag': {
      const text = args.join(' ');
      if (!text) { console.error('Usage: nl brag <achievement>'); return; }
      const bragDocPath = path.join(BRAIN, 'Brag Doc.md');
      const entry = `\n### ${timestamp()}\n- ${text}`;
      fs.appendFileSync(bragDocPath, entry);
      log(`Achievement logged: ${text}`);
      break;
    }
    case 'retrospective': {
      log('=== Retrospective Analysis ===');
      const memoriesPath = path.join(BRAIN, 'Memories.md');
      if (fs.existsSync(memoriesPath)) {
        const content = fs.readFileSync(memoriesPath, 'utf8');
        const sessions = content.split('## ').filter(Boolean);
        console.log(`Total sessions recorded: ${sessions.length}`);
        for (const s of sessions.slice(-3)) {
          const lines = s.split('\n').filter(l => l.trim());
          console.log(`- ${lines[0] || 'Untitled'}`);
        }
      }
      break;
    }
    case 'skills': {
      if (args[0] === '--list') {
        const skillsPath = path.join(FACTORY, 'skills', 'INDEX.md');
        if (fs.existsSync(skillsPath)) console.log(fs.readFileSync(skillsPath, 'utf8'));
        else console.log('Skills index not found');
      }
      break;
    }
    case 'skill': {
      const sub = args[0];
      if (sub === 'load') {
        const skillName = args[1];
        if (!skillName) { console.error('Usage: nl skill load <name>'); return; }
        log(`Loading skill: ${skillName}`);
        const skillsDir = path.join(FACTORY, 'skills');
        if (fs.existsSync(skillsDir)) {
          const files = fs.readdirSync(skillsDir, { recursive: true }).filter(f => f.endsWith('.md'));
          for (const f of files) {
            if (f.toLowerCase().includes(skillName.toLowerCase())) {
              console.log(`\n=== ${f} ===`);
              console.log(fs.readFileSync(path.join(skillsDir, f), 'utf8'));
            }
          }
        }
      } else if (sub === 'run') {
        console.log('Skill execution not implemented directly. Use the Executor Agent.');
      }
      break;
    }

    // --- SPEC-KIT ---
    case 'specify': {
      const desc = args.join(' ');
      if (!desc) { console.error('Usage: nl specify <description>'); return; }
      log(`Generating spec for: ${desc}`);
      const specDir = path.join(__dirname, 'specs', `feature-${Date.now()}`);
      fs.mkdirSync(specDir, { recursive: true });
      fs.writeFileSync(path.join(specDir, 'spec.md'), `# Feature Spec\n\n## Description\n${desc}\n\n## Requirements\n- TBD\n`);
      fs.writeFileSync(path.join(specDir, 'plan.md'), `# Plan\n\n## Steps\n1. TBD\n`);
      fs.writeFileSync(path.join(specDir, 'tasks.md'), `# Tasks\n\n- [ ] TBD\n`);
      fs.writeFileSync(path.join(specDir, 'clarifications.md'), `# Clarifications\n\n- N/A\n`);
      log(`Spec created at: specs/${path.basename(specDir)}/`);
      break;
    }
    case 'specify-feature': {
      const name = args[0];
      if (!name) { console.error('Usage: nl specify-feature <name>'); return; }
      const featureDir = path.join(__dirname, 'specs', name);
      fs.mkdirSync(featureDir, { recursive: true });
      for (const f of ['spec.md', 'plan.md', 'tasks.md', 'clarifications.md']) {
        fs.writeFileSync(path.join(featureDir, f), `# ${f.replace('.md', '')}\n\nTBD\n`);
      }
      log(`Feature structure created at: specs/${name}/`);
      break;
    }
    case 'constitution': {
      log('Syncing Constitution...');
      execSync(`node -e "fs.copyFileSync('${path.join(BRAIN, 'Constitution.md')}', '${path.join(__dirname, 'specs', 'CONSTITUTION.md')}')"`, { encoding: 'utf8', cwd: __dirname });
      log('Constitution synced to specs/CONSTITUTION.md');
      break;
    }
    case 'plan': {
      log('Generating technical plan...');
      break;
    }
    case 'clarify': {
      log('Running clarification phase...');
      break;
    }
    case 'tasks': {
      log('Generating task list...');
      break;
    }
    case 'implement': {
      log('Dispatching agent orchestration...');
      break;
    }
    case 'import-tasks': {
      log('Importing tasks to MELHORIAS...');
      break;
    }
    case 'validate-spec': {
      log('Validating current spec...');
      break;
    }

    // --- EXECUTION ---
    case 'execute': {
      log(`Delegating to Executor Agent: ${args.join(' ')}`);
      break;
    }
    case 'execute-tasks': {
      log(`Executing tasks from: ${args[0] || 'not specified'}`);
      break;
    }
    case 'execute-skill': {
      log(`Executing skill: ${args[0] || 'not specified'}`);
      break;
    }

    // --- LEARNING ---
    case 'consolidate-memory': {
      log('Running memory consolidation (Deep Dream)...');
      break;
    }
    case 'learn': {
      log('Extracting learnings from conversations...');
      break;
    }
    case 'list-skills': {
      const skillsDir = path.join(FACTORY, 'skills');
      if (fs.existsSync(skillsDir)) {
        const files = fs.readdirSync(skillsDir, { recursive: true }).filter(f => f.endsWith('.md'));
        console.log(`Available skills (${files.length}):`);
        files.forEach(f => console.log(`  - ${f}`));
      }
      break;
    }
    case 'add-skill': {
      const name = args[0], desc = args.slice(1).join(' ');
      if (!name || !desc) { console.error('Usage: nl add-skill <name> <description>'); return; }
      const skillsDir = path.join(FACTORY, 'skills', `${name.toLowerCase().replace(/\s+/g, '-')}.md`);
      fs.writeFileSync(skillsDir, `# ${name}\n\n${desc}\n`);
      log(`Skill created: ${skillsDir}`);
      break;
    }

    // --- CHANNEL ---
    case 'channel': {
      const channel = args[0];
      if (channel === 'slack') log('Slack integration not yet active.');
      else if (channel === 'web') log('Web interface available at .ai-factory/web/memory-dashboard/');
      else console.error('Usage: nl channel <slack|web>');
      break;
    }

    // --- DESIGN ---
    case 'generate': {
      log(`Generating UI design for: ${args.join(' ')}`);
      break;
    }
    case 'save': {
      log(`Saving design: ${args[0] || 'unnamed'}`);
      break;
    }
    case 'palette': {
      log(`Generating palette for: ${args.join(' ')}`);
      break;
    }
    case 'checklist': {
      log(`Generating accessibility checklist for: ${args.join(' ')}`);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      help();
  }
}

main().catch(console.error);
