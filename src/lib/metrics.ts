import { prisma } from "@/lib/prisma";
import { DashboardMetrics } from "@/types/metrics";

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  try {
    // Get base metrics using Prisma's aggregation
    const metricsData = await prisma.conversionMetric.aggregate({
      where: {
        userId
      },
      _count: {
        _all: true,
        success: true
      },
      _avg: {
        processingTime: true,
        complexityScore: true,
        compressionRatio: true
      },
      _sum: {
        contentSize: true
      }
    });

    // Get all the metrics in parallel for better performance
    const [
      activeConversions,
      conversionAccuracy,
      apiUsage,
      efficiencyScore,
      overallPerformance
    ] = await Promise.all([
      getActiveConversions(userId),
      getConversionAccuracy(userId),
      getApiUsage(userId),
      calculateEfficiencyScore(userId),
      calculateOverallPerformance(userId)
    ]);

    // Calculate quality metrics
    const avgComplexityScore = metricsData._avg.complexityScore || 0;
    const avgCompressionRatio = metricsData._avg.compressionRatio || 0;
    const successRate = (metricsData._count.success / metricsData._count._all) * 100;
    
    const dataQuality = Math.round((avgComplexityScore * 0.4) + (avgCompressionRatio * 0.6));
    const outputQuality = Math.round((avgCompressionRatio * 0.3) + (successRate * 0.7));
    
    return {
      totalProjects: metricsData._count._all,
      activeConversions,
      successfulConversions: metricsData._count.success,
      failedConversions: metricsData._count._all - metricsData._count.success,
      averageProcessingTime: Math.round(metricsData._avg.processingTime || 0),
      totalDataProcessed: Math.round((metricsData._sum.contentSize || 0) / 1024), // Convert to KB
      conversionAccuracy,
      apiUsage,
      userEfficiencyScore: efficiencyScore,
      overallPerformance,
      averageDataQuality: Math.min(100, Math.max(0, dataQuality)),
      averageOutputQuality: Math.min(100, Math.max(0, outputQuality))
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return {
      totalProjects: 0,
      activeConversions: 0,
      successfulConversions: 0,
      failedConversions: 0,
      averageProcessingTime: 0,
      totalDataProcessed: 0,
      conversionAccuracy: 0,
      apiUsage: 0,
      userEfficiencyScore: 0,
      overallPerformance: 0,
      averageDataQuality: 0,
      averageOutputQuality: 0
    };
  }
}

// Helper functions for specific metrics
async function getActiveConversions(userId: string): Promise<number> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const count = await prisma.conversionMetric.count({
    where: {
      userId,
      createdAt: {
        gte: twentyFourHoursAgo
      }
    }
  });
  
  return count;
}

async function getConversionAccuracy(userId: string): Promise<number> {
  const metrics = await prisma.conversionMetric.aggregate({
    where: {
      userId
    },
    _count: {
      _all: true,
      success: true
    }
  });
  
  const successRate = metrics._count.success / metrics._count._all * 100;
  return Math.round(successRate || 0);
}

async function getApiUsage(userId: string): Promise<number> {
  const metrics = await prisma.conversionMetric.aggregate({
    where: {
      userId
    },
    _avg: {
      apiCalls: true
    }
  });
  
  // Convert average API calls to a percentage (assuming 10 calls is 100%)
  const usagePercentage = ((metrics._avg.apiCalls || 0) / 10) * 100;
  return Math.round(Math.min(100, usagePercentage));
}

async function calculateEfficiencyScore(userId: string): Promise<number> {
  const metrics = await prisma.conversionMetric.aggregate({
    where: {
      userId
    },
    _avg: {
      complexityScore: true,
      processingTime: true
    }
  });
  
  // Calculate efficiency based on complexity and processing time
  const avgComplexity = metrics._avg.complexityScore || 0;
  const avgProcessingTime = metrics._avg.processingTime || 0;
  
  // Lower processing time and higher complexity means better efficiency
  const efficiency = (avgComplexity * 100) / (avgProcessingTime + 1);
  return Math.round(Math.min(100, efficiency));
}

async function calculateOverallPerformance(userId: string): Promise<number> {
  const metrics = await prisma.conversionMetric.aggregate({
    where: {
      userId
    },
    _avg: {
      complexityScore: true,
      compressionRatio: true,
      apiCalls: true
    },
    _count: {
      _all: true,
      success: true
    }
  });
  
  // Calculate weighted performance score
  const successRate = (metrics._count.success / metrics._count._all) * 100;
  const complexityScore = metrics._avg.complexityScore || 0;
  const compressionScore = metrics._avg.compressionRatio || 0;
  const apiEfficiency = 100 - (((metrics._avg.apiCalls || 0) / 10) * 100);
  
  const performance = (
    (successRate * 0.4) +
    (complexityScore * 0.2) +
    (compressionScore * 0.2) +
    (apiEfficiency * 0.2)
  );
  
  return Math.round(Math.min(100, performance));
}