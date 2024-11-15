import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma/index";
import { currentUser } from "@clerk/nextjs/server";

// Add middleware to check authentication
async function authenticateUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    // Use the new authentication method
    const clerkUser = await authenticateUser();
    const clerkId = clerkUser.id;

    let user;
    try {
      user = await db.user.upsert({
        where: { clerkId },
        update: {},
        create: { clerkId },
        select: { id: true }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const [allTimeMetrics, todayMetrics] = await Promise.all([
        db.conversionMetric.aggregate({
          where: { 
            userId: user.id, 
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
          },
          _count: { _all: true, success: true },
          _avg: { 
            processingTime: true, 
            complexityScore: true, 
            compressionRatio: true 
          },
          _sum: { contentSize: true, apiCalls: true }
        }),
        db.conversionMetric.count({ 
          where: { 
            userId: user.id, 
            createdAt: { gte: today } 
          } 
        })
      ]);

      // Calculate all metrics with fallbacks
      const totalConversions = allTimeMetrics._count._all || 0;
      const successfulConversions = allTimeMetrics._count.success || 0;
      const failedConversions = totalConversions - successfulConversions;
      const successRate = totalConversions > 0 ? (successfulConversions / totalConversions) * 100 : 0;
      
      // Process averages with fallbacks
      const avgProcessingTime = Math.round(allTimeMetrics._avg.processingTime || 0);
      const avgComplexityScore = Math.round(allTimeMetrics._avg.complexityScore || 0);
      const avgCompressionRatio = Math.round(allTimeMetrics._avg.compressionRatio || 0);
      
      // Calculate quality scores
      const qualityMetrics = calculateQualityMetrics(
        avgComplexityScore,
        avgCompressionRatio,
        successRate
      );

      // Format the response to match DashboardMetrics interface
      return NextResponse.json({
        // Core metrics
        totalProjects: totalConversions,
        activeConversions: todayMetrics || 0,
        successfulConversions,
        failedConversions,
        
        // Time and processing metrics
        averageProcessingTime: avgProcessingTime,
        totalDataProcessed: Math.round((allTimeMetrics._sum.contentSize || 0) / 1024),
        
        // Quality and performance metrics
        conversionAccuracy: Math.round(successRate),
        apiUsage: Math.min(100, ((allTimeMetrics._sum.apiCalls || 0) / 10) * 100),
        userEfficiencyScore: qualityMetrics.efficiency,
        overallPerformance: qualityMetrics.overall,
        
        // Additional quality metrics
        averageDataQuality: qualityMetrics.dataQuality,
        averageOutputQuality: qualityMetrics.outputQuality,
      });

    } catch (metricsError) {
      console.error('Metrics calculation error:', metricsError);
      return NextResponse.json({ 
        // Return safe fallback values on error
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
        averageOutputQuality: 0,
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Use the new authentication method
    const clerkUser = await authenticateUser();
    const clerkId = clerkUser.id;

    const user = await db.user.findUnique({ 
      where: { clerkId } 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { input, output, startTime, error = null, success = true } = body;

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const processingTime = Date.now() - startTime;
    const contentSize = new TextEncoder().encode(input).length;
    const outputSize = output ? new TextEncoder().encode(output).length : 0;
    const complexityScore = calculateComplexityScore(input);
    const compressionRatio = calculateCompressionRatio(contentSize, outputSize);
    const performanceMetrics = calculatePerformanceMetrics(processingTime, complexityScore);

    const metric = await db.conversionMetric.create({
      data: {
        userId: user.id,
        contentSize,
        processingTime,
        complexityScore: performanceMetrics.complexity,
        compressionRatio,
        success,
        apiCalls: 1,
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      metric: {
        id: metric.id,
        processingTime,
        complexityScore,
        compressionRatio,
        ...performanceMetrics
      }
    });
  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json({ error: 'Failed to record metrics' }, { status: 500 });
  }
}

function calculateCompressionRatio(inputSize: number, outputSize: number) {
  if (outputSize === 0) return 1;
  const ratio = inputSize / outputSize;
  return Number(Math.max(1, Math.min(ratio, 100)).toFixed(2));
}

function calculateComplexityScore(input: string) {
  const depth = (input.match(/[{[]/g) || []).length;
  const nestingLevel = (input.match(/[{}[\]]/g) || []).length / 2;
  const properties = (input.match(/["'][^"']+["']\s*:/g) || []).length;
  const length = input.length;

  const score = ((depth * 15) + (nestingLevel * 10) + (properties * 5) + (length / 200)) / 4;
  return Number(Math.min(100, score).toFixed(2));
}

function calculatePerformanceMetrics(processingTime: number, complexity: number) {
  const baseEfficiency = Math.max(0, 100 - (processingTime / 50));
  const complexityFactor = Math.max(0, 100 - complexity);
  const overallPerformance = (baseEfficiency + complexityFactor) / 2;

  return {
    efficiency: Number(baseEfficiency.toFixed(2)),
    complexity: Number(complexity.toFixed(2)),
    overall: Number(overallPerformance.toFixed(2))
  };
}

function calculateQualityMetrics(complexityScore: number, compressionRatio: number, successRate: number) {
  // Ensure all inputs have fallback values
  const safeComplexity = complexityScore || 0;
  const safeCompression = compressionRatio || 0;
  const safeSuccess = successRate || 0;

  // Calculate quality metrics
  const dataQuality = Math.round((safeComplexity * 0.4) + (safeCompression * 0.6));
  const outputQuality = Math.round((safeCompression * 0.3) + (safeSuccess * 0.7));
  const efficiency = Math.round((100 - safeComplexity) * 0.5 + safeSuccess * 0.5);
  const overall = Math.round(
    (dataQuality * 0.3) +
    (outputQuality * 0.3) +
    (efficiency * 0.4)
  );

  // Ensure all values are within 0-100 range
  return {
    dataQuality: Math.min(100, Math.max(0, dataQuality)),
    outputQuality: Math.min(100, Math.max(0, outputQuality)),
    efficiency: Math.min(100, Math.max(0, efficiency)),
    overall: Math.min(100, Math.max(0, overall))
  };
}