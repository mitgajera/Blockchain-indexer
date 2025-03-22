import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { deleteWebhook, createWebhook } from '@/lib/helius';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = parseInt(session.user.id);
  const configId = parseInt(req.query.id as string);

  if (isNaN(configId)) {
    return res.status(400).json({ message: 'Invalid configuration ID' });
  }

  // Check if the config belongs to the user
  const config = await prisma.indexingConfig.findFirst({
    where: {
      id: configId,
      userId,
    },
  });

  if (!config) {
    return res.status(404).json({ message: 'Configuration not found' });
  }

  switch (req.method) {
    case 'GET':
      return getConfig(req, res, config);
    case 'PATCH':
      return updateConfig(req, res, config, userId);
    case 'DELETE':
      return deleteConfig(req, res, config, userId);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a specific configuration
function getConfig(
  req: NextApiRequest,
  res: NextApiResponse,
  config: any
) {
  return res.status(200).json({ config });
}

// Update a configuration
async function updateConfig(
  req: NextApiRequest,
  res: NextApiResponse,
  config: any,
  userId: number
) {
  try {
    const { name, nftBids, tokenPrices, borrowableTokens, customAddresses, isActive } = req.body;

    // Prepare update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (nftBids !== undefined) updateData.nftBids = nftBids;
    if (tokenPrices !== undefined) updateData.tokenPrices = tokenPrices;
    if (borrowableTokens !== undefined) updateData.borrowableTokens = borrowableTokens;
    if (customAddresses !== undefined) updateData.customAddresses = customAddresses;
    
    // Handle active status change
    if (isActive !== undefined) {
      updateData.isActive = isActive;
      
      // If setting to active, deactivate other configs
      if (isActive) {
        await prisma.indexingConfig.updateMany({
          where: {
            userId,
            id: { not: config.id },
          },
          data: { isActive: false },
        });
      }
    }

    // If webhook-relevant fields are changed, update the webhook
    if (nftBids !== undefined || tokenPrices !== undefined || borrowableTokens !== undefined || customAddresses !== undefined) {
      // Delete old webhook
      if (config.webhookId) {
        await deleteWebhook(config.webhookId);
      }

      // Create new webhook
      const webhookURL = `${process.env.NEXT_PUBLIC_API_URL}/api/webhook/${userId}`;
      
      const transactionTypes = [];
      if (nftBids ?? config.nftBids) transactionTypes.push('NFT_BID');
      if (tokenPrices ?? config.tokenPrices) transactionTypes.push('TOKEN_PRICE');
      if (borrowableTokens ?? config.borrowableTokens) transactionTypes.push('BORROWABLE_TOKEN');

      const { webhookID } = await createWebhook({
        webhookURL,
        transactionTypes,
        accountAddresses: customAddresses ?? config.customAddresses,
      });

      updateData.webhookId = webhookID;
    }

    // Update the configuration
    const updatedConfig = await prisma.indexingConfig.update({
      where: { id: config.id },
      data: updateData,
    });

    // Log the update event
    await prisma.indexingLog.create({
      data: {
        userId,
        eventType: 'CONFIG_UPDATED',
        status: 'SUCCESS',
        message: `Updated indexing configuration: ${updatedConfig.name}`,
        metadata: {
          configId: updatedConfig.id,
          changes: updateData,
        },
      },
    });

    return res.status(200).json({ config: updatedConfig });
  } catch (error) {
    console.error('Error updating indexing config:', error);
    
    // Log the error
    await prisma.indexingLog.create({
      data: {
        userId,
        eventType: 'CONFIG_UPDATED',
        status: 'ERROR',
        message: `Failed to update indexing configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          configId: config.id,
          requestBody: req.body,
        },
      },
    });
    
    return res.status(500).json({ message: 'Failed to update indexing configuration' });
  }
}

// Delete a configuration
async function deleteConfig(
  req: NextApiRequest,
  res: NextApiResponse,
  config: any,
  userId: number
) {
  try {
    // Don't allow deleting active configs
    if (config.isActive) {
      return res.status(400).json({ 
        message: 'Cannot delete an active configuration. Please deactivate it first.' 
      });
    }

    // Delete webhook if it exists
    if (config.webhookId) {
      await deleteWebhook(config.webhookId);
    }

    // Delete the configuration
    await prisma.indexingConfig.delete({
      where: { id: config.id },
    });

    // Log the deletion event
    await prisma.indexingLog.create({
      data: {
        userId,
        eventType: 'CONFIG_DELETED',
        status: 'SUCCESS',
        message: `Deleted indexing configuration: ${config.name}`,
        metadata: {
          configId: config.id,
        },
      },
    });

    return res.status(200).json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting indexing config:', error);
    
    // Log the error
    await prisma.indexingLog.create({
      data: {
        userId,
        eventType: 'CONFIG_DELETED',
        status: 'ERROR',
        message: `Failed to delete indexing configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          configId: config.id,
        },
      },
    });
    
    return res.status(500).json({ message: 'Failed to delete indexing configuration' });
  }
}