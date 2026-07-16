#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const AGENTS_DIR = path.join(__dirname, '..', 'agents');

function inferCategory(name) {
  if (/security|audit|threat|vulnerab/.test(name)) return 'security';
  if (/deploy|docker|kubernet|terraform/.test(name)) return 'devops';
  if (/test|qa|debug|error/.test(name)) return 'testing';
  if (/doc|wiki|writing/.test(name)) return 'documentation';
  if (/design|ui|ux/.test(name)) return 'design';
  if (/data|analytics|seo|market/.test(name)) return 'data';
  if (/api|architect|refactor|pattern/.test(name)) return 'architecture';
  if (/agent|memory|prompt/.test(name)) return 'ai';
  if (/game|social|email|content/.test(name)) return 'content';
  return 'general';
}

function inferComplexity(content) {
  const lines = content.split('\n').length;
  if (lines > 300) return 'high';
  if (lines > 100) return 'medium';
  return 'low';
}

function addFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.startsWith('---')) return false;
  const name = path.basename(filePath, path.extname(filePath));
  const category = inferCategory(name);
  const complexity = inferComplexity(content);
  const fm = `---
name: ${name}
category: ${category}
complexity: ${complexity}
agents: []
created: ${new Date().toISOString().slice(0, 10)}
---

`;
  fs.writeFileSync(filePath, fm + content);
  return true;
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) scanDir(full);
    else if (entry.name.endsWith('.md')) addFrontmatter(full);
  }
}

function main() {
  let count = 0;
  scanDir(SKILLS_DIR);
  scanDir(AGENTS_DIR);
  console.log(JSON.stringify({ status: 'ok', adapted: count }));
}

if (require.main === module) main();
module.exports = { addFrontmatter, inferCategory };
