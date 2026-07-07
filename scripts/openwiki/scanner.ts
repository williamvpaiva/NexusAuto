import fs from 'fs';
import path from 'path';

export async function scanRepo(rootDir: string): Promise<string> {
  // Simple scanner to grab README, package.json, and some key structure
  let context = 'Project Structure:\n';
  
  function readDirRecursive(dir: string, depth: number = 0) {
    if (depth > 2) return; // Limit depth
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (['node_modules', '.git', 'dist', 'build'].includes(file)) continue;
      
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        context += `${'  '.repeat(depth)}- ${file}/\n`;
        readDirRecursive(fullPath, depth + 1);
      } else {
        context += `${'  '.repeat(depth)}- ${file}\n`;
      }
    }
  }

  readDirRecursive(rootDir);

  // Grab some important files
  try {
    const readme = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf-8');
    context += `\n\n--- README.md ---\n${readme.substring(0, 1000)}...\n`;
  } catch (e) {}

  try {
    const pkg = fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8');
    context += `\n\n--- package.json ---\n${pkg}\n`;
  } catch (e) {}

  return context;
}
