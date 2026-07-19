const { execSync } = require('child_process');
const path = require('path');

const isPostToolUse = process.argv.includes('--commit');

if (!isPostToolUse) {
  const hotPath = path.join(__dirname, '..', 'wiki', 'hot.md');
  try {
    const fs = require('fs');
    const content = fs.readFileSync(hotPath, 'utf8');
    console.log('[wiki] hot.md loaded (' + content.length + ' chars)');
    console.log(content.slice(0, 500));
  } catch {
    console.log('[wiki] hot.md not found — starting new session');
  }
  process.exit(0);
}

const files = [
  'wiki/',
  'hooks/',
  '.claude-plugin/',
  'AGENTS.md',
  'GEMINI.md',
  'WIKI.md'
];

try {
  execSync('git add ' + files.join(' '), { stdio: 'pipe' });
  try {
    execSync('git diff --cached --quiet', { stdio: 'pipe' });
  } catch {
    execSync('git commit -m "chore: auto-sync wiki/hooks [skip ci]"', { stdio: 'pipe' });
    console.log('[hooks] auto-commit done');
  }
} catch (e) {
  console.log('[hooks] skipped: ' + e.message);
}
