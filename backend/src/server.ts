import { app } from './app';
import { env } from './config/env';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   NexusAuto Backend                                      ║
║                                                           ║
║   Environment: ${env.appEnv.padEnd(41)}║
║   Port: ${String(PORT).padEnd(50)}║
║   Origin: ${env.frontendOrigin.padEnd(46)}║
║                                                           ║
║   Health: http://localhost:${String(PORT).padEnd(31)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
});