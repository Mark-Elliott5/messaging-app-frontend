import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      build: {
        outDir: 'build',
      },
    };
  } else {
    // command === 'build'
    return {
      plugins: [react()],
      build: {
        outDir: 'build',
        sourcemap: true,
        minify: false,
      },
    };
  }
});
