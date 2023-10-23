import { nodeResolve } from '@rollup/plugin-node-resolve';
import userscript from "userscript-meta-cli";

export default {
  input: "src/index.js",
  output: {
    format: "esm",
    file: "dist/embed-me.user.js",
    banner: userscript.stringify(userscript.getMeta())
  },
  plugins: [
    nodeResolve()
  ]
};
