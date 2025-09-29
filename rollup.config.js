import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/index.js", format: "cjs" },
    { file: "dist/index.esm.js", format: "esm" },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      extract: true,
      minimize: true,
      modules: false,
      plugins: [],
    }),
  ],
  external: ["react", "lucide-react", "react-virtuoso"],
};
