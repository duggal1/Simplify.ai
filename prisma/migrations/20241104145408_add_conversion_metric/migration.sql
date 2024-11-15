-- CreateTable
CREATE TABLE "ConversionMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentSize" INTEGER NOT NULL,
    "processingTime" INTEGER NOT NULL,
    "complexityScore" DOUBLE PRECISION NOT NULL,
    "compressionRatio" DOUBLE PRECISION NOT NULL,
    "success" BOOLEAN NOT NULL,
    "apiCalls" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversionMetric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConversionMetric" ADD CONSTRAINT "ConversionMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
