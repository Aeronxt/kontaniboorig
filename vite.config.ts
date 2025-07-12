import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
    },
    build: {
      // Fix bundling issues that cause initialization errors
      target: 'es2018',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@chakra-ui/react', 'framer-motion'],
          },
          // Ensure proper variable naming to avoid conflicts
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
      // Ensure proper module format
      cssCodeSplit: true,
      sourcemap: false,
      // Reduce bundling complexity
      chunkSizeWarningLimit: 1000,
    },
    define: {
      // Expose env variables safely
      'process.env': JSON.stringify(env),
      // Define global properly for compatibility
      global: 'globalThis',
    },
    server: {
      // Add proper HMR configuration
      hmr: {
        overlay: false, // Disable the error overlay
      },
    },
  };
});
