import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { dstlTheme } from './src/dstl-theme.ts';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [dstlTheme],
				preset: [
					{ name: 'modern', enhancements: true },
					{ name: 'wintry', enhancements: true },
					{ name: 'hamlindigo', enhancements: true },
					{ name: 'gold-nouveau', enhancements: true }
				]
			}
		})
	]
} satisfies Config;
