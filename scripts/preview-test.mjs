import { preview } from 'astro';
// Use the API so automated checks keep a foreground server even in agent shells.
const server = await preview({ server: {host:'127.0.0.1', port:Number(process.argv[2] || 4347)} });
console.log(`Test preview ready on ${process.argv[2] || 4347}`);
for (const signal of ['SIGINT','SIGTERM']) process.once(signal, async () => {await server.stop();process.exit(0);});
