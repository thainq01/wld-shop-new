import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { BigNumber } from "bignumber.js";
import { useAuthWorld } from "./authStore";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8086";

export interface Token {
  decimals: number;
  name: string;
  symbol: string;
  address: string;
  logo_url: string;
  native_token: boolean;
  balance: string;
  quote_rate: string;
  quote: string;
  type: string;
}

export interface TokenHoldstation {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  logo_url: string;
  native_token: boolean;
  type: string;
  balance: string;
  quote_rate: string;
  quote: string;
  amount: string;
}

interface BalanceStore {
  balances: Token[];
  totalBalanceWld: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
}

type Actions = {
  fetchBalance: (address: string) => Promise<boolean>;
  findToken: (address?: string) => Token;
  setBalances: (balances: Token[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const initialBalances: Token[] = [
  {
    decimals: 18,
    name: "Worldcoin",
    symbol: "WLD",
    address: "0x2cfc85d8e48f8eab294be644d9e25c3030863003",
    logo_url:
      "https://static.holdstation.com/tokens/chain/480/0x2cfc85d8e48f8eab294be644d9e25c3030863003.png",
    native_token: false,
    balance: "0",
    quote_rate: "0.720809",
    quote: "0",
    type: "verified",
  },
];

export const useBalance = create<BalanceStore & Actions>()(
  immer((set, get) => ({
    balances: initialBalances,
    totalBalanceWld: 0,
    isLoading: false,
    error: null,
    lastFetched: 0,

    setBalances: (balances: Token[]) => {
      set((state) => {
        state.balances = balances;
        state.totalBalanceWld = balances.reduce((total, token) => {
          return total + parseFloat(token.quote || "0");
        }, 0);
        state.lastFetched = Date.now();
      });
    },

    setLoading: (loading: boolean) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error: string | null) => {
      set((state) => {
        state.error = error;
      });
    },

    findToken: (address?: string) => {
      if (!address) {
        return initialBalances[0];
      }
      const balances = get().balances;
      const token = balances.find(
        (v) => v.address.toLowerCase() === address.toLowerCase()
      );
      return token ?? initialBalances[0];
    },
    fetchBalance: async (address: string) => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        const url = new URL(`/api/user-balance/${address}`, API_BASE_URL);
        url.searchParams.set("t", Date.now().toString());
        const response = await fetch(url.toString());

        console.log("response", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resp = await response.json();

        // Check if response is successful and contains data
        if (!resp.success || !resp.data) {
          throw new Error("Invalid response format");
        }

        const item = resp.data as TokenHoldstation;

        // Convert single token to our Token format
        const isZero = new BigNumber(item.balance)
          .dividedBy(10 ** item.contract_decimals)
          .lt(0.00001);

        const token: Token = {
          decimals: item.contract_decimals,
          name: item.contract_name,
          symbol: item.contract_ticker_symbol,
          address: item.contract_address,
          logo_url: item.logo_url || "",
          native_token: item.native_token,
          balance: isZero ? "0" : item.balance,
          quote_rate: item.quote_rate,
          quote: isZero ? "0" : item.quote,
          type: item.type,
        };

        const tokens: Token[] = [token];

        // Update store with fetched balances
        get().setBalances(tokens);

        set((state) => {
          state.isLoading = false;
        });

        return true;
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error =
            error instanceof Error ? error.message : "Failed to fetch balance";
        });
        return false;
      }
    },
  }))
);

export function useFetchBalance() {
  const { fetchBalance, isLoading, error, balances } = useBalance(
    useShallow((state) => ({
      fetchBalance: state.fetchBalance,
      isLoading: state.isLoading,
      error: state.error,
      balances: state.balances,
    }))
  );

  const { address } = useAuthWorld();

  return {
    fetchBalance: (walletAddress?: string) =>
      fetchBalance(walletAddress || address),
    balances,
    isLoading,
    error,
    isError: !!error,
  };
}
