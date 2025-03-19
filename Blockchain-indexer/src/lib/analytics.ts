import { prisma } from './prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

interface DailyMetrics {
  date: string;
  transactionsProcessed: number;
  successCount: number;
  errorCount: number;
}

// Get daily transaction metrics for a specific user
export async function getUserDailyMetrics(userId: number, days = 7): Promise<DailyMetrics[]> {
  const metrics: DailyMetrics[] = [];
  
  // Generate dates for the last n days
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const startDate = startOfDay(date); 
    const endDate = endOfDay(date);
    
    // Get counts for this day
    const logs = await prisma.indexingLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    
    const successCount = logs.filter(log => log.status === 'SUCCESS').length;
    const errorCount = logs.filter(log => log.status === 'ERROR').length;
    
    metrics.push({
      date: format(date, 'yyyy-MM-dd'),
      transactionsProcessed: logs.length,
      successCount,
      errorCount,
    });
  }
  
  return metrics;
}


 // Get summary of event types for a user
 
export async function getUserEventSummary(userId: number) {
  const eventTypes = await prisma.indexingLog.groupBy({
    by: ['eventType', 'status'],
    where: {
      userId,
    },
    _count: {
      id: true,
    },
  });
  
  return eventTypes.map(event => ({
    eventType: event.eventType,
    status: event.status,
    count: event._count.id,
  }));
}

/**
 * Get the last n events for a user
 */
export async function getRecentEvents(userId: number, limit = 10) {
  return prisma.indexingLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Get summary statistics for the whole platform
 * Only available to admin users
 */
export async function getPlatformMetrics() {
  const userCount = await prisma.user.count();
  const activeConnectionsCount = await prisma.dbConnection.count({
    where: {
      isActive: true,
    },
  });
  const activeConfigsCount = await prisma.indexingConfig.count({
    where: {
      isActive: true,
    },
  });
  
  const todayStart = startOfDay(new Date());
  const yesterdayStart = startOfDay(subDays(new Date(), 1));
  
  const todayTransactions = await prisma.indexingLog.count({
    where: {
      createdAt: {
        gte: todayStart,
      },
      eventType: 'DATA_INDEXED',
      status: 'SUCCESS',
    },
  });
  
  const yesterdayTransactions = await prisma.indexingLog.count({
    where: {
      createdAt: {
        gte: yesterdayStart,
        lt: todayStart,
      },
      eventType: 'DATA_INDEXED',
      status: 'SUCCESS',
    },
  });
  
  return {
    userCount,
    activeConnectionsCount,
    activeConfigsCount,
    todayTransactions,
    yesterdayTransactions,
    growth: todayTransactions > 0 && yesterdayTransactions > 0 
      ? ((todayTransactions - yesterdayTransactions) / yesterdayTransactions) * 100
      : 0,
  };
}