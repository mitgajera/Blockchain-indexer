import { Pool, PoolConfig } from 'pg';
import { DbConnection } from '@prisma/client';

export async function testConnection(connection: {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}): Promise<{ success: boolean; message: string }> {
  const config: PoolConfig = {
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.ssl ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 5000,
  };

  const pool = new Pool(config);

  try {
    const client = await pool.connect();
    client.release();
    await pool.end();
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    await pool.end();
    return { 
      success: false, 
      message: `Connection failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

export async function executeQuery(connection: DbConnection, query: string, params: any[] = []): Promise<any> {
  const config: PoolConfig = {
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.ssl ? { rejectUnauthorized: false } : undefined,
  };

  const pool = new Pool(config);

  try {
    const result = await pool.query(query, params);
    await pool.end();
    return result.rows;
  } catch (error) {
    await pool.end();
    throw error;
  }
}