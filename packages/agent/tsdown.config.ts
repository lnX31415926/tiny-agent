import { defineConfig } from "tsdown";
export default defineConfig({
  entry: "src/index",
  format: ["esm"],
  clean: true,
});
