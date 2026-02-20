import { describe, expect, it } from "vitest";
import { getMisticPayService } from "./misticpay";

describe("MisticPay Integration", () => {
  it("should validate credentials by checking balance", async () => {
    const service = getMisticPayService();
    
    // This will throw an error if credentials are invalid
    const result = await service.getBalance();
    
    expect(result).toHaveProperty("balance");
    expect(typeof result.balance).toBe("number");
  }, 10000); // 10 second timeout for API call
});
