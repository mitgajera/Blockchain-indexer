import type { NextApiRequest, NextApiResponse } from 'next';
import { processWebhook } from '@/lib/webhook-processor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = parseInt(req.query.userId as string);

  try {
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Process the webhook data
    await processWebhook(req.body, userId);

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Failed to process webhook' });
  }
}