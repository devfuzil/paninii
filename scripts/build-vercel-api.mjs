import * as esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function build() {
  const opts = {
    platform: "node",
    format: "esm",
    bundle: true,
    packages: "external",
    sourcemap: false,
    minify: true,
  };

  await esbuild.build({
    ...opts,
    entryPoints: {
      "api/trpc/trpc-handler": path.join(root, "api/trpc/[...path].source.ts"),
      "api/webhook/misticpay-handler": path.join(root, "api/webhook/misticpay.source.ts"),
    },
    outdir: root,
  });
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
