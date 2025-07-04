// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(["build/**/*"], "Ignore build directory"),
    eslint.configs.recommended,
    tseslint.configs.recommended,
]);
