import {
  wldToWei,
  weiToWld,
  PAYMENT_SERVICE_CONFIG,
  executePaymentService,
} from "../paymentService";

// Mock MiniKit
const mockMiniKit = {
  isInstalled: jest.fn(),
  commandsAsync: {
    sendTransaction: jest.fn(),
  },
};

// Mock the MiniKit module
jest.mock("@worldcoin/minikit-js", () => ({
  MiniKit: mockMiniKit,
}));

describe("PaymentService Utils", () => {
  describe("wldToWei", () => {
    it("should convert WLD to wei correctly", () => {
      expect(wldToWei(1)).toBe("1000000000000000000");
      expect(wldToWei(0.5)).toBe("500000000000000000");
      expect(wldToWei(10.25)).toBe("10250000000000000000");
    });

    it("should handle zero amount", () => {
      expect(wldToWei(0)).toBe("0");
    });

    it("should handle small amounts", () => {
      expect(wldToWei(0.000001)).toBe("1000000000000");
    });
  });

  describe("weiToWld", () => {
    it("should convert wei to WLD correctly", () => {
      expect(weiToWld("1000000000000000000")).toBe(1);
      expect(weiToWld("500000000000000000")).toBe(0.5);
      expect(weiToWld("10250000000000000000")).toBe(10.25);
    });

    it("should handle zero amount", () => {
      expect(weiToWld("0")).toBe(0);
    });

    it("should handle small amounts", () => {
      expect(weiToWld("1000000000000")).toBe(0.000001);
    });
  });

  describe("PAYMENT_SERVICE_CONFIG", () => {
    it("should have correct contract addresses", () => {
      expect(PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS).toBe(
        "0x8f894C64de54bE90c256C7fbd51ff2240Ee82F1b"
      );
      expect(PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS).toBe(
        "0x2cFc85d8E48F8EAB294be644d9E25C3030863003"
      );
      expect(PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS).toBe(
        "0x5744c7c3b2825f6478673676015657a9c81594ba"
      );
    });

    it("should have valid Ethereum addresses", () => {
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;
      expect(PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS).toMatch(addressRegex);
      expect(PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS).toMatch(addressRegex);
      expect(PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS).toMatch(addressRegex);
    });
  });

  describe("executePaymentService", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockMiniKit.isInstalled.mockReturnValue(true);
    });

    it("should validate MiniKit installation", async () => {
      mockMiniKit.isInstalled.mockReturnValue(false);

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("MiniKit is not installed");
    });

    it("should validate payment amount", async () => {
      await expect(
        executePaymentService({
          amount: "0",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("Invalid payment amount");

      await expect(
        executePaymentService({
          amount: "",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("Invalid payment amount");
    });

    it("should validate reference ID", async () => {
      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "",
        })
      ).rejects.toThrow("Invalid reference ID");

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "   ",
        })
      ).rejects.toThrow("Invalid reference ID");
    });

    it("should validate Ethereum addresses", async () => {
      await expect(
        executePaymentService(
          {
            amount: "1000000000000000000",
            referenceId: "test-order-123",
          },
          "invalid-address"
        )
      ).rejects.toThrow("Invalid token address");

      await expect(
        executePaymentService(
          {
            amount: "1000000000000000000",
            referenceId: "test-order-123",
          },
          PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS,
          "invalid-address"
        )
      ).rejects.toThrow("Invalid recipient address");
    });

    it("should validate amount format", async () => {
      await expect(
        executePaymentService({
          amount: "not-a-number",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("Invalid amount format");
    });

    it("should handle successful payment", async () => {
      const mockResponse = {
        finalPayload: {
          status: "success",
          transaction_id: "0x123456789abcdef",
        },
      };
      mockMiniKit.commandsAsync.sendTransaction.mockResolvedValue(mockResponse);

      const result = await executePaymentService({
        amount: "1000000000000000000",
        referenceId: "test-order-123",
      });

      expect(result).toBe(mockResponse);
      expect(mockMiniKit.commandsAsync.sendTransaction).toHaveBeenCalledWith({
        transaction: [
          {
            address: PAYMENT_SERVICE_CONFIG.CONTRACT_ADDRESS,
            abi: expect.any(Array),
            functionName: "pay",
            args: [
              PAYMENT_SERVICE_CONFIG.WLD_TOKEN_ADDRESS,
              PAYMENT_SERVICE_CONFIG.RECIPIENT_ADDRESS,
              "1000000000000000000",
              "test-order-123",
            ],
          },
        ],
      });
    });

    it("should handle invalid contract error", async () => {
      const mockError = new Error("invalid contract address");
      mockMiniKit.commandsAsync.sendTransaction.mockRejectedValue(mockError);

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("invalid_contract");
    });

    it("should handle user rejected error", async () => {
      const mockError = new Error("user_rejected transaction");
      mockMiniKit.commandsAsync.sendTransaction.mockRejectedValue(mockError);

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("user_rejected");
    });

    it("should handle insufficient balance error", async () => {
      const mockError = new Error("insufficient balance");
      mockMiniKit.commandsAsync.sendTransaction.mockRejectedValue(mockError);

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("insufficient_balance");
    });

    it("should handle network error", async () => {
      const mockError = new Error("network error occurred");
      mockMiniKit.commandsAsync.sendTransaction.mockRejectedValue(mockError);

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("invalid_network");
    });

    it("should validate response structure", async () => {
      mockMiniKit.commandsAsync.sendTransaction.mockResolvedValue(null);

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("Invalid response from MiniKit");

      mockMiniKit.commandsAsync.sendTransaction.mockResolvedValue({});

      await expect(
        executePaymentService({
          amount: "1000000000000000000",
          referenceId: "test-order-123",
        })
      ).rejects.toThrow("Invalid response from MiniKit");
    });
  });
});
