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
  const connectionId = parseInt(req.query.id as string);

  // Check if the connection exists and belongs to the user
  const connection = await prisma.dbConnection.findFirst({
    where: {
      id: connectionId,
      userId,
    },
  });

  if (!connection) {
    return res.status(404).json({ message: 'Database connection not found' });
  }

  // PATCH - Update a connection
  if (req.method === 'PATCH') {
    try {
      const { host, port, database, username, password, ssl, isActive } = req.body;

      // If making this connection active, deactivate all others
      if (isActive) {
        await prisma.dbConnection.updateMany({
          where: {
            userId,
            id: { not: connectionId },
          },
          data: {
            isActive: false,
          },
        });
      }

      // Update the connection
      const updatedConnection = await prisma.dbConnection.update({
        where: { id: connectionId },
        data: {
          host: host !== undefined ? host : undefined,
          port: port !== undefined ? parseInt(port) : undefined,
          database: database !== undefined ? database : undefined,
          username: username !== undefined ? username : undefined,
          password: password !== undefined ? password : undefined,
          ssl: ssl !== undefined ? ssl : undefined,
          isActive: isActive !== undefined ? isActive : undefined,
        },
      });

      return res.status(200).json({ 
        connection: {
          ...updatedConnection,
          password: undefined,
        }
      });
    } catch (error) {
      console.error('Error updating DB connection:', error);
      return res.status(500).json({ message: 'Failed to update database connection' });
    }
  }

  // DELETE - Delete a connection
  if (req.method === 'DELETE') {
    try {
      await prisma.dbConnection.delete({
        where: { id: connectionId },
      });

      return res.status(200).json({ message: 'Database connection deleted successfully' });
    } catch (error) {
      console.error('Error deleting DB connection:', error);
      return res.status(500).json({ message: 'Failed to delete database connection' });
    }
  }

  // GET - Get connection details
  if (req.method === 'GET') {
    return res.status(200).json({ 
      connection: {
        ...connection,
        password: undefined,
      }
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}