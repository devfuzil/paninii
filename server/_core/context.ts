import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { IncomingMessage, ServerResponse } from "node:http";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  return { req: opts.req, res: opts.res };
}

/** Context for Vercel/serverless (node-http adapter). */
export async function createNodeContext(opts: {
  req: IncomingMessage;
  res: ServerResponse;
  info: unknown;
}): Promise<TrpcContext> {
  return { req: opts.req as TrpcContext["req"], res: opts.res as TrpcContext["res"] };
}
