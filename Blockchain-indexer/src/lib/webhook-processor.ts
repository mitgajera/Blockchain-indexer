import { prisma } from './prisma';
import { executeQuery } from './database';
import { IndexingConfig } from '@prisma/client';

interface WebhookData {
  transactions: WebhookTransaction[];
}

interface WebhookTransaction {
  type: string;
  signature: string;
  timestamp: number;
  slot: number;
  data: any;
}

export async function processWebhook(data: WebhookData, userId: number): Promise<void> {
  try {
    // Get user's active indexing config
    const config = await prisma.indexingConfig.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        user: {
          include: {
            dbConnections: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!config || !config.user.dbConnections.length) {
      await logEvent(userId, 'WEBHOOK_RECEIVED', 'ERROR', 'No active configuration or database connection found');
      return;
    }

    const dbConnection = config.user.dbConnections[0];

    // Process each transaction based on its type
    for (const tx of data.transactions) {
      await processTransaction(tx, config, dbConnection.id);
    }

    await logEvent(userId, 'WEBHOOK_PROCESSED', 'SUCCESS', `Processed ${data.transactions.length} transactions`);
  } catch (error) {
    console.error('Webhook processing error:', error);
    await logEvent(
      userId,
      'WEBHOOK_PROCESSING',
      'ERROR',
      `Error processing webhook: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

async function processTransaction(
  transaction: WebhookTransaction,
  config: IndexingConfig,
  dbConnectionId: number
): Promise<void> {
  const dbConnection = await prisma.dbConnection.findUnique({
    where: { id: dbConnectionId },
  });

  if (!dbConnection) return;

  try {
    // Get the appropriate database table based on transaction type
    const targetTable = getTargetTable(transaction.type);
    if (!targetTable) return;

    // Check if we should process this transaction type based on user's config
    if (!shouldProcessTransaction(transaction.type, config)) return;

    // Prepare data for insertion
    const { columns, values, placeholders } = prepareInsertData(transaction);

    // Execute the insert query
    const query = `INSERT INTO ${targetTable} (${columns.join(', ')}) VALUES (${placeholders})`;
    await executeQuery(dbConnection, query, values);

    await logEvent(
      config.userId,
      'DATA_INDEXED',
      'SUCCESS',
      `Indexed ${transaction.type} data`,
      { signature: transaction.signature, type: transaction.type }
    );
  } catch (error) {
    await logEvent(
      config.userId, 
      'DATA_INDEXING', 
      'ERROR', 
      `Failed to index ${transaction.type} data: ${error instanceof Error ? error.message : String(error)}`,
      { signature: transaction.signature, type: transaction.type }
    );
  }
}

function getTargetTable(transactionType: string): string | null {
  switch (transactionType) {
    case 'NFT_BID':
      return 'nft_bids';
    case 'TOKEN_PRICE':
      return 'token_prices';
    case 'BORROWABLE_TOKEN':
      return 'borrowable_tokens';
    default:
      return null;
  }
}

function shouldProcessTransaction(transactionType: string, config: IndexingConfig): boolean {
  switch (transactionType) {
    case 'NFT_BID':
      return config.nftBids;
    case 'TOKEN_PRICE':
      return config.tokenPrices;
    case 'BORROWABLE_TOKEN':
      return config.borrowableTokens;
    default:
      return false;
  }
}

function prepareInsertData(transaction: WebhookTransaction): { columns: string[], values: any[], placeholders: string } {
  const data = transaction.data;
  const columns = Object.keys(data);
  const values = Object.values(data);
  
  // Add metadata columns
  columns.push('signature', 'transaction_type', 'timestamp');
  values.push(transaction.signature, transaction.type, new Date(transaction.timestamp));
  
  const placeholders = values.map((_, i) => `$${i+1}`).join(', ');
  
  return { columns, values, placeholders };
}

async function logEvent(
  userId: number,
  eventType: string,
  status: string,
  message: string,
  metadata?: Record<string, any>
): Promise<void> {
  await prisma.indexingLog.create({
    data: {
      userId,
      eventType,
      status,
      message,
      metadata: metadata || {},
    },
  });
}