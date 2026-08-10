import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  // Component CSS is imported from each .tsx and bundled into a single
  // dist/index.css. Consumers import it once: `@travl/ui/styles.css`.
  // Not injected at runtime — a design system should never fight the
  // consumer's cascade order.
  injectStyle: false,
  external: ['react', 'react-dom', '@travl/tokens'],
});