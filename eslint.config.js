import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    extends: [js.configs.recommended, prettierConfig],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      'no-unused-vars': [
<<<<<<< HEAD
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
=======
        'warn', // 첫 번째 요소: 심각도 (경고)
    {
      argsIgnorePattern: '^_',   // 두 번째 요소: 옵션 객체
      varsIgnorePattern: '^_',
      // 다른 옵션들도 여기에 추가 가능
    }
  ]}
>>>>>>> 9d39c4b (feat fix)
  },
]);
