import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { testConnection } from '@/lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { host, port, database, username, password, ssl } = req.body;

    // Validate required fields
    if (!host || !port || !database || !username || !password) {
      return res.status(400).json({ message: 'All connection details are required' });
    }

    const result = await testConnection({
      host,
      port: parseInt(port),
      database,
      username,
      password,
      ssl: !!ssl,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error testing connection:', error);
    return res.status(500).json({ message: 'Failed to test database connection' });
  }
}