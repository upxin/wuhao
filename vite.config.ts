import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from 'path';

export default defineConfig(async () => {
  const UnoCSS = await import('unocss/vite').then(i => i.default)
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components/'),
      },
    },
    plugins: [
      uni(),
      UnoCSS()
    ],
  }
});
