import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = parseInt(session.user.id);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { limit = '50', offset = '0', eventType, status } = req.query;

    // Build the where clause
    const where = {
      userId,
      ...(eventType ? { eventType: eventType as string } : {}),
      ...(status ? { status: status as string } : {}),
    };

    // Get logs with pagination
    const logs = await prisma.indexingLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    // Get total count
    const totalCount = await prisma.indexingLog.count({ where });

    return res.status(200).json({ 
      logs,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return res.status(500).json({ message: 'Failed to fetch logs' });
  }
}