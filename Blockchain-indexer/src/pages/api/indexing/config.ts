import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { createWebhook } from '@/lib/helius';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = parseInt(session.user.id);

  // GET - List user's indexing configurations
  if (req.method === 'GET') {
    try {
      const configs = await prisma.indexingConfig.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({ configs });
    } catch (error) {
      console.error('Error fetching indexing configurations:', error);
      return res.status(500).json({ message: 'Failed to fetch indexing configurations' });
    }
  }
  
  // POST - Create a new indexing configuration
  if (req.method === 'POST') {
    try {
      const { name, nftBids, tokenPrices, borrowableTokens, customAddresses } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: 'Configuration name is required' });
      }

      // Check if user has any active database connection
      const activeConnection = await prisma.dbConnection.findFirst({
        where: {
          userId,
          isActive: true,
        },
      });

      if (!activeConnection) {
        return res.status(400).json({ message: 'You must set up an active database connection first' });
      }

      // Create the webhook for this configuration
      const webhookURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${userId}`;
      
      // Determine transaction types based on user selection
      const transactionTypes = [];
      if (nftBids) transactionTypes.push('NFT_BID');
      if (tokenPrices) transactionTypes.push('TOKEN_PRICE');
      if (borrowableTokens) transactionTypes.push('BORROWABLE_TOKEN');

      // Create Helius webhook
      const { webhookID } = await createWebhook({
        webhookURL,
        transactionTypes,
        accountAddresses: customAddresses || [],
      });

      // Create the configuration
      const config = await prisma.indexingConfig.create({
        data: {
          userId,
          name,
          nftBids: !!nftBids,
          tokenPrices: !!tokenPrices,
          borrowableTokens: !!borrowableTokens,
          customAddresses: customAddresses || [],
          webhookId: webhookID,
          isActive: false,
        },
      });

      return res.status(201).json({ config });
    } catch (error) {
      console.error('Error creating indexing configuration:', error);
      return res.status(500).json({ message: 'Failed to create indexing configuration' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}