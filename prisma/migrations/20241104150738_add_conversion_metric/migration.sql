-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ConversionMetric" DROP CONSTRAINT "ConversionMetric_userId_fkey";

-- AlterTable
ALTER TABLE "ConversionMetric" ALTER COLUMN "contentSize" SET DEFAULT 0,
ALTER COLUMN "processingTime" SET DEFAULT 0,
ALTER COLUMN "processingTime" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "complexityScore" SET DEFAULT 0,
ALTER COLUMN "compressionRatio" SET DEFAULT 1,
ALTER COLUMN "success" SET DEFAULT true,
ALTER COLUMN "apiCalls" SET DEFAULT 1;

-- CreateIndex
CREATE INDEX "ConversionMetric_userId_idx" ON "ConversionMetric"("userId");

-- CreateIndex
CREATE INDEX "ConversionMetric_createdAt_idx" ON "ConversionMetric"("createdAt");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversionMetric" ADD CONSTRAINT "ConversionMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
