import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import Critters from 'critters';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      transform: async (html) => {
        const critters = new Critters({
          path: './',
          logLevel: 'silent',
          inlineFonts: true,
          preload: 'media',
          reduceInlineStyles: false,
        });
        return await critters.process(html);
      },
    }),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
}); 