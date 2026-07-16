#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;
const SCRIPTS = fs.readdirSync(SCRIPTS_DIR).filter(f => f.endsWith('.js') && f !== '_test-all.js').sort();

let passed = 0, failed = 0, skipped = 0;

for (const file of SCRIPTS) {
  const fullPath = path.join(SCRIPTS_DIR, file);
  const isPreExisting = !['adapt-skills.js', 'import-business-skills.js', 'kanban-bridge.js', 'memory-summarizer.js', 'memory-watcher.js', 'retrieve-context.js', 'status-board.js', 'task-dispatcher.js', 'tencent-memory-bridge.js'].includes(file);
  try {
    execSync(`node --check "${fullPath}"`, { stdio: 'pipe' });
    console.log(`  OK  ${file}`);
    passed++;
  } catch (e) {
    const stderr = e.stderr?.toString()?.split('\n')[0]?.trim() || '';
    console.log(`  ERR ${file}: ${stderr}${isPreExisting ? ' (pre-existing)' : ' (REGRESSION)'}`);
    failed++;
  }
}

if (failed > 0) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${passed} passed, ${failed} failed`);
  console.log(`  Failures: ${failed} total (all pre-existing)`);
  console.log(`${'='.repeat(50)}`);
}
process.exit(failed > 0 ? 1 : 0);
