import type { IncomingMessage } from "node:http";
import type { ServerResponse } from "node:http";
import { nodeHTTPRequestHandler } from "@trpc/server/adapters/node-http";
import { appRouter } from "../server/routers";
import { createNodeContext } from "../server/_core/context";

const TRPC_PREFIX = "/api/trpc";

function getPathFromUrl(url: string | undefined): string {
  if (!url) return "";
  const pathname = url.startsWith("http") ? new URL(url).pathname : url.split("?")[0] || "";
  const path = pathname.replace(new RegExp(`^${TRPC_PREFIX}/?`), "").trim();
  return path || "";
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const path = getPathFromUrl(req.url ?? "");
  await nodeHTTPRequestHandler({
    router: appRouter,
    createContext: createNodeContext,
    req,
    res,
    path,
    maxBodySize: 50 * 1024 * 1024, // 50mb, align with Express
  });
}
