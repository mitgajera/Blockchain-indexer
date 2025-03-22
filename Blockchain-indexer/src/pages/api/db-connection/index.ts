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

  // GET - List user's database connections
  if (req.method === 'GET') {
    try {
      const connections = await prisma.dbConnection.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json({ 
        connections: connections.map(conn => ({
          ...conn,
          password: undefined, // Don't send password to client
        }))
      });
    } catch (error) {
      console.error('Error fetching DB connections:', error);
      return res.status(500).json({ message: 'Failed to fetch database connections' });
    }
  }
  
  // POST - Create a new database connection
  if (req.method === 'POST') {
    try {
      const { host, port, database, username, password, ssl } = req.body;

      // Validate required fields
      if (!host || !port || !database || !username || !password) {
        return res.status(400).json({ message: 'All connection details are required' });
      }

      // Create the connection
      const connection = await prisma.dbConnection.create({
        data: {
          userId,
          host,
          port: parseInt(port),
          database,
          username,
          password, // Note: In production, encrypt this password
          ssl: !!ssl,
          isActive: false,
        },
      });

      return res.status(201).json({ 
        connection: { 
          ...connection,
          password: undefined, // Don't send password to client
        }
      });
    } catch (error) {
      console.error('Error creating DB connection:', error);
      return res.status(500).json({ message: 'Failed to create database connection' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}