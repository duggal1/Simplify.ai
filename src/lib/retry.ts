interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  onRetry?: (error: Error, attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
    onRetry = () => {},
    shouldRetry = () => true
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw new Error('Operation failed with non-Error object');
      }
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw new Error(`Operation failed after ${attempt} attempts: ${error.message}`);
      }

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * factor, maxDelay);

      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 200 - 100;
      const finalDelay = delay + jitter;
      // Call the onRetry callback
      onRetry(error as Error, attempt);

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, finalDelay));
    }
  }

  // This line should never be reached since we either return or throw inside the loop
  throw new Error('Operation failed: Maximum attempts reached');
}

// Utility function to determine if an error is retryable
export function isRetryableError(error: Error): boolean {
  const retryableErrors = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'EPIPE',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'ENOTFOUND',
    'EAI_AGAIN'
  ];

  return (
    error.name === 'NetworkError' ||
    error.message.includes('timeout') ||
    error.message.includes('rate limit') ||
    retryableErrors.some(code => error.message.includes(code))
  );
}

// Example usage with custom retry conditions
export const customRetry = {
  network: {
    maxAttempts: 5,
    initialDelay: 500,
    shouldRetry: isRetryableError
  },
  rateLimited: {
    maxAttempts: 3,
    initialDelay: 2000,
    factor: 3,
    shouldRetry: (error: Error) => 
      error.message.includes('rate limit') || 
      error.message.includes('429')
  },
  quickRetry: {
    maxAttempts: 2,
    initialDelay: 100,
    maxDelay: 200,
    factor: 1.5
  }
}; 