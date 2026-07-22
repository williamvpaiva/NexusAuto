import MemoryWatcher from '../.ai-factory/scripts/memory-watcher.js';

const watcher = new MemoryWatcher();
watcher.start();
console.log('👁️ Memory Watcher iniciado. Pressione Ctrl+C para parar.');

// Lidar com graceful shutdown
process.on('SIGINT', () => {
    watcher.stop();
    process.exit(0);
});
