import { useState, useEffect } from "react";
import { useAuthWorld } from "../store/authStore";

// WLD token contract address on World Chain
const WLD_CONTRACT_ADDRESS = "0x2cfc85d8e48f8eab294be644d9e25c3030863003";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8086";

interface TokenBalance {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  logo_url: string | null;
  native_token: boolean;
  type: string;
  balance: string;
  quote_rate: string;
  quote: string;
  amount: string;
  tokenStatus: number;
}

interface BalanceResponse {
  success: boolean;
  data: TokenBalance;
  statusCode: number;
}

/**
 * Hook to fetch and manage WLD balance for the authenticated user
 * Uses HoldStation API to get real balance data from World Chain
 */
export function useWLDBalance() {
  const { address } = useAuthWorld();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      setError(null);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch balance from API
        const response = await fetch(
          `${API_BASE_URL}/api/user-balance/${address}`
        );

        console.log("response", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BalanceResponse = await response.json();

        // Check if the response is successful and contains WLD token data
        if (
          data.success &&
          data.data &&
          data.data.contract_address.toLowerCase() ===
            WLD_CONTRACT_ADDRESS.toLowerCase()
        ) {
          // Convert balance from wei to WLD (18 decimals)
          const balanceInWei = BigInt(data.data.balance);
          const decimals = BigInt(data.data.contract_decimals);
          const balanceInWLD =
            Number(balanceInWei) / Math.pow(10, Number(decimals));

          setBalance(balanceInWLD);
        } else {
          // WLD token not found or request failed, balance is 0
          setBalance(0);
        }
      } catch (err) {
        console.error("Failed to fetch WLD balance:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch balance"
        );
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  const refetchBalance = () => {
    if (address) {
      const fetchBalance = async () => {
        setIsLoading(true);
        setError(null);

        try {
          // Fetch balance from API
          const response = await fetch(
            `${API_BASE_URL}/api/user-balance/${address}`
          );

          console.log(response);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: BalanceResponse = await response.json();

          // Check if the response is successful and contains WLD token data
          if (
            data.success &&
            data.data &&
            data.data.contract_address.toLowerCase() ===
              WLD_CONTRACT_ADDRESS.toLowerCase()
          ) {
            // Convert balance from wei to WLD (18 decimals)
            const balanceInWei = BigInt(data.data.balance);
            const decimals = BigInt(data.data.contract_decimals);
            const balanceInWLD =
              Number(balanceInWei) / Math.pow(10, Number(decimals));

            setBalance(balanceInWLD);
          } else {
            // WLD token not found or request failed, balance is 0
            setBalance(0);
          }
        } catch (err) {
          console.error("Failed to fetch WLD balance:", err);
          setError(
            err instanceof Error ? err.message : "Failed to fetch balance"
          );
          setBalance(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBalance();
    }
  };

  return {
    balance,
    isLoading,
    error,
    refetchBalance,
  };
}
