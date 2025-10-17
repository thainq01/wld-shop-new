import type { IPInfoResponse } from "../types";

/**
 * Fetches user's IP information from ipinfo.io
 * @returns Promise<IPInfoResponse | null> - Returns IP info or null if failed
 */
export async function fetchUserIPInfo(): Promise<IPInfoResponse | null> {
  try {
    console.log("🌍 Fetching user IP information from ipinfo.io...");

    const response = await fetch("https://ipinfo.io/json", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const ipInfo: IPInfoResponse = await response.json();
    console.log("✅ IP information fetched successfully:", ipInfo);

    return ipInfo;
  } catch (error) {
    console.error("❌ Failed to fetch IP information:", error);
    return null;
  }
}

/**
 * Formats IP information into a JSON string for userMetadata
 * @param ipInfo - The IP information from ipinfo.io
 * @returns string - JSON string of formatted metadata
 */
export function formatUserMetadata(ipInfo: IPInfoResponse): string {
  try {
    // Format metadata to match the exact structure from ipinfo.io
    const metadata = {
      ip: ipInfo.ip,
      city: ipInfo.city || null,
      region: ipInfo.region || null,
      country: ipInfo.country || null,
      loc: ipInfo.loc || null,
      org: ipInfo.org || null,
      postal: ipInfo.postal || null,
      timezone: ipInfo.timezone || null,
      readme: ipInfo.readme || null,
      // Add timestamp for when this metadata was collected
      collectedAt: new Date().toISOString(),
    };

    return JSON.stringify(metadata);
  } catch (error) {
    console.error("❌ Failed to format user metadata:", error);
    // Return basic metadata as fallback
    return JSON.stringify({
      ip: ipInfo.ip,
      country: ipInfo.country || null,
      collectedAt: new Date().toISOString(),
    });
  }
}

/**
 * Fetches and formats user metadata for API submission
 * @returns Promise<string | null> - Returns formatted metadata string or null if failed
 */
export async function getUserMetadata(): Promise<string | null> {
  const ipInfo = await fetchUserIPInfo();
  if (!ipInfo) {
    return null;
  }

  return formatUserMetadata(ipInfo);
}

/**
 * Updates user metadata for an existing user by wallet address
 * @param walletAddress - The user's wallet address
 * @returns Promise<boolean> - Returns true if successful, false if failed
 */
export async function updateUserMetadata(
  walletAddress: string
): Promise<boolean> {
  try {
    console.log("🔄 Updating metadata for wallet:", walletAddress);

    const userMetadata = await getUserMetadata();
    if (!userMetadata) {
      console.log("❌ Failed to fetch IP metadata for update");
      return false;
    }

    // Import usersApi dynamically to avoid circular imports
    const { usersApi } = await import("./api");

    await usersApi.updateMetadata(walletAddress, userMetadata);
    console.log("✅ User metadata updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to update user metadata:", error);
    return false;
  }
}
