import path from 'path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
    esbuild: {
        loader: "ts", // Se os arquivos forem TypeScript
      },
    resolve: {
        alias: {
          '@src': path.resolve(__dirname, './src'), // Certifique-se que o alias aponta para a pasta correta
        },
      },
    //   extensions: ['.js', '.ts'], // Adicione .ts caso esteja usando TypeScript
    test: {}
})