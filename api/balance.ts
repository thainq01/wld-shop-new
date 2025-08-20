import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    // Proxy request to HoldStation API
    const holdstationUrl = `https://cms.holdstation.com/api/user-balance/chain/480/wallet/${address}`;
    
    const response = await fetch(holdstationUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Vercel-Serverless)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HoldStation API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the data with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Balance fetch error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch balance',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
