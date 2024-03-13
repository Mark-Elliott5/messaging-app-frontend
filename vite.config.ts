import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [react()],
      build: {
        emptyOutDir: true,
        outDir: 'build',
        sourcemap: true,
      },
    };
  } else {
    // command === 'build'
    return {
      plugins: [
        react(),
        {
          name: 'renameIndex',
          enforce: 'post',
          generateBundle(options, bundle) {
            const indexHtml = bundle['index.html'];
            indexHtml.fileName = 'app.html';
          },
        },
      ],
      build: {
        emptyOutDir: true,
        outDir: 'build',
        sourcemap: true,
        minify: false,
      },
    };
  }
});
