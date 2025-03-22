import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { createWebhook } from '@/lib/helius';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = parseInt(session.user.id);

  switch (req.method) {
    case 'GET':
      return getConfigs(req, res, userId);
    case 'POST':
      return createConfig(req, res, userId);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all indexing configurations for the user
async function getConfigs(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: number
) {
  try {
    const configs = await prisma.indexingConfig.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ configs });
  } catch (error) {
    console.error('Error fetching indexing configs:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Create a new indexing configuration
async function createConfig(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: number
) {
  try {
    const { name, nftBids, tokenPrices, borrowableTokens, customAddresses, isActive } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Configuration name is required' });
    }

    if (!nftBids && !tokenPrices && !borrowableTokens && (!customAddresses || customAddresses.length === 0)) {
      return res.status(400).json({ message: 'At least one data type or custom address must be selected' });
    }

    // Generate webhook URL for this configuration
    const webhookURL = `${process.env.NEXT_PUBLIC_API_URL}/api/webhook/${userId}`;

    // Create Helius webhook
    const transactionTypes = [];
    if (nftBids) transactionTypes.push('NFT_BID');
    if (tokenPrices) transactionTypes.push('TOKEN_PRICE');
    if (borrowableTokens) transactionTypes.push('BORROWABLE_TOKEN');

    const { webhookID } = await createWebhook({
      webhookURL,
      transactionTypes,
      accountAddresses: customAddresses,
    });

    // If this is set as active, deactivate other configs
    if (isActive) {
      await prisma.indexingConfig.updateMany({
        where: { userId },
        data: { isActive: false },
      });
    }

    // Create configuration in database
    const config = await prisma.indexingConfig.create({
      data: {
        name,
        nftBids,
        tokenPrices,
        borrowableTokens,
        customAddresses,
        webhookId: webhookID,
        isActive: !!isActive,
        userId,
      },
    });

    // Log the creation event
    await prisma.indexingLog.create({
      data: {
        userId,
        eventType: 'CONFIG_CREATED',
        status: 'SUCCESS',
        message: `Created indexing configuration: ${name}`,
        metadata: {
          configId: config.id,
          webhookId: webhookID,
        },
      },
    });

    return res.status(201).json({ config });
  } catch (error) {
    console.error('Error creating indexing config:', error);
    
    // Log the error
    await prisma.indexingLog.create({
      data: {
        userId,
        eventType: 'CONFIG_CREATED',
        status: 'ERROR',
        message: `Failed to create indexing configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          requestBody: req.body,
        },
      },
    });
    
    return res.status(500).json({ message: 'Failed to create indexing configuration' });
  }
}