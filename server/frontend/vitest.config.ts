import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [
		svelte({
			hot: false,
			configFile: 'svelte.config.test.js'
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['src/tests/setup.ts'],
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/lib/**/*.{js,ts,svelte}'],
			exclude: ['src/tests/**/*', 'src/**/*.test.{js,ts}', 'src/**/*.spec.{js,ts}']
		}
	}
});
