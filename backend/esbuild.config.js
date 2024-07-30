const { build } = require("esbuild");

build({
  entryPoints: ["server.ts"],
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: "node",
  target: "node20",
  outfile: "dist/server.js",
}).catch(() => process.exit(1));