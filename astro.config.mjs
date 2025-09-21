import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  vite: { server: { port: 4321 } }
});
