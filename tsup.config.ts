import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  format: ["cjs", "esm"],
  dts: true,
  external: ["zustand", "react"],
  clean: true,
  minify: true,
});
