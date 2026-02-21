import type { IncomingMessage, ServerResponse } from "node:http";
import { handleMisticpayWebhook } from "../../server/webhook";

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf-8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, data: object) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    send(res, 405, { error: "Method not allowed" });
    return;
  }
  try {
    const body = await readBody(req);
    const result = await handleMisticpayWebhook(body);
    if (result.ok) {
      send(res, 200, { success: true, message: "Webhook processed successfully" });
      return;
    }
    send(res, result.status, result.body);
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    send(res, 500, { error: "Internal server error" });
  }
}
