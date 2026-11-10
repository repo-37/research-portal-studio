import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

// StyleX compiles `stylex.create` and `xstyle` at build time. It runs before
// the React plugin so JSX is still available to its Babel pass.
export default defineConfig({
  plugins: [stylex.vite(), react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // Reachable from the fleet, not just loopback: research pages get shared.
  // allowedHosts covers the tailnet by name as well as by address, because a
  // dev server reached through MagicDNS refuses an unlisted Host header.
  server: {
    host: '0.0.0.0',
    port: 3774,
    strictPort: true,
    allowedHosts: ['.ts.net', 'rog-g14.tail643194.ts.net'],
  },
  preview: {
    host: '0.0.0.0',
    port: 3774,
    strictPort: true,
  },
});
