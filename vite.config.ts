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
  server: {
    port: 5173,
  },
});
