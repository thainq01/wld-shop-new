import { useState, useEffect } from "react";
import { useAuthWorld } from "../store/authStore";

// WLD token contract address on World Chain
const WLD_CONTRACT_ADDRESS = "0x2cfc85d8e48f8eab294be644d9e25c3030863003";

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
  data: TokenBalance[];
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
        // Use different endpoints for development vs production
        const isDev = import.meta.env.DEV;
        const apiUrl = isDev
          ? `/api/cms/api/user-balance/chain/480/wallet/${address}`
          : `/api/balance?address=${address}`;

        // Fetch balance from HoldStation API
        const response = await fetch(apiUrl);

        console.log("response", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BalanceResponse = await response.json();

        // Find WLD token in the response
        const wldToken = data.data.find(
          (token) =>
            token.contract_address.toLowerCase() ===
            WLD_CONTRACT_ADDRESS.toLowerCase()
        );

        if (wldToken) {
          // Convert balance from wei to WLD (18 decimals)
          const balanceInWei = BigInt(wldToken.balance);
          const decimals = BigInt(wldToken.contract_decimals);
          const balanceInWLD =
            Number(balanceInWei) / Math.pow(10, Number(decimals));

          setBalance(balanceInWLD);
        } else {
          // WLD token not found, balance is 0
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
          // Use different endpoints for development vs production
          const isDev = import.meta.env.DEV;
          const apiUrl = isDev
            ? `/api/cms/api/user-balance/chain/480/wallet/${address}`
            : `/api/balance?address=${address}`;

          // Fetch balance from HoldStation API
          const response = await fetch(apiUrl);

          console.log(response);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: BalanceResponse = await response.json();

          // Find WLD token in the response
          const wldToken = data.data.find(
            (token) =>
              token.contract_address.toLowerCase() ===
              WLD_CONTRACT_ADDRESS.toLowerCase()
          );

          if (wldToken) {
            // Convert balance from wei to WLD (18 decimals)
            const balanceInWei = BigInt(wldToken.balance);
            const decimals = BigInt(wldToken.contract_decimals);
            const balanceInWLD =
              Number(balanceInWei) / Math.pow(10, Number(decimals));

            setBalance(balanceInWLD);
          } else {
            // WLD token not found, balance is 0
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
