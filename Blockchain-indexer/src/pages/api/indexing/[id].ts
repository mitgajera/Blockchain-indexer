import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { deleteWebhook, createWebhook } from '@/lib/helius';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = parseInt(session.user.id);
  const configId = parseInt(req.query.id as string);

  // Check if the config exists and belongs to the user
  const config = await prisma.indexingConfig.findFirst({
    where: {
      id: configId,
      userId,
    },
  });

  if (!config) {
    return res.status(404).json({ message: 'Indexing configuration not found' });
  }

  // PATCH - Update a configuration
  if (req.method === 'PATCH') {
    try {
      const { name, nftBids, tokenPrices, borrowableTokens, customAddresses, isActive } = req.body;

      // If making this config active, deactivate all others
      if (isActive) {
        await prisma.indexingConfig.updateMany({
          where: {
            userId,
            id: { not: configId },
          },
          data: {
            isActive: false,
          },
        });
      }

      // Check if we need to update the webhook
      let webhookId = config.webhookId;
      if ((nftBids !== undefined && nftBids !== config.nftBids) || 
          (tokenPrices !== undefined && tokenPrices !== config.tokenPrices) ||
          (borrowableTokens !== undefined && borrowableTokens !== config.borrowableTokens) ||
          (customAddresses !== undefined && JSON.stringify(customAddresses) !== JSON.stringify(config.customAddresses))) {
        
        // Delete old webhook if it exists
        if (config.webhookId) {
          await deleteWebhook(config.webhookId);
        }
        
        // Create new webhook
        const webhookURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${userId}`;
        
        // Determine transaction types based on user selection
        const transactionTypes = [];
        if (nftBids !== undefined ? nftBids : config.nftBids) transactionTypes.push('NFT_BID');
        if (tokenPrices !== undefined ? tokenPrices : config.tokenPrices) transactionTypes.push('TOKEN_PRICE');
        if (borrowableTokens !== undefined ? borrowableTokens : config.borrowableTokens) transactionTypes.push('BORROWABLE_TOKEN');

        const { webhookID } = await createWebhook({
          webhookURL,
          transactionTypes,
          accountAddresses: customAddresses || config.customAddresses,
        });
        
        webhookId = webhookID;
      }

      // Update the configuration
      const updatedConfig = await prisma.indexingConfig.update({
        where: { id: configId },
        data: {
          name: name !== undefined ? name : undefined,
          nftBids: nftBids !== undefined ? nftBids : undefined,
          tokenPrices: tokenPrices !== undefined ? tokenPrices : undefined,
          borrowableTokens: borrowableTokens !== undefined ? borrowableTokens : undefined,
          customAddresses: customAddresses !== undefined ? customAddresses : undefined,
          webhookId,
          isActive: isActive !== undefined ? isActive : undefined,
        },
      });

      return res.status(200).json({ config: updatedConfig });
    } catch (error) {
      console.error('Error updating indexing configuration:', error);
      return res.status(500).json({ message: 'Failed to update indexing configuration' });
    }
  }

  // DELETE - Delete a configuration
  if (req.method === 'DELETE') {
    try {
      // Delete the webhook if it exists
      if (config.webhookId) {
        await deleteWebhook(config.webhookId);
      }

      await prisma.indexingConfig.delete({
        where: { id: configId },
      });

      return res.status(200).json({ message: 'Indexing configuration deleted successfully' });
    } catch (error) {
      console.error('Error deleting indexing configuration:', error);
      return res.status(500).json({ message: 'Failed to delete indexing configuration' });
    }
  }

  // GET - Get configuration details
  if (req.method === 'GET') {
    return res.status(200).json({ config });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}