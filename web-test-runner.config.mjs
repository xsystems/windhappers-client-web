import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
    browsers: [
        playwrightLauncher({ product: 'chromium' }),
        // playwrightLauncher({ product: 'firefox' }),
        // playwrightLauncher({ product: 'webkit' }),
    ],
    plugins: [esbuildPlugin({ ts: true })],
    files: ['test/**/*.test.ts'],
    nodeResolve: true,
    coverage: true
};
