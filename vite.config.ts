import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    define: {
      __APP_MODE__: JSON.stringify(command), // 'serve' or 'build'
    },
    base: command === 'build' ? '/phasmophobia_diary/' : '/',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      cors: true, // enable CORS for all origins
    },
  };
});
