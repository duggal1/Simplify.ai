export const metrics = {
  recordConversion: (data: {
    success: boolean;
    duration: number;
    requestId: string;
    error?: string;
  }) => {
    // Implement your metrics recording logic
  }
}
