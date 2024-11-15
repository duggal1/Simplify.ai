export function handleApiError(error: unknown): { error: string; status: number } {
  if (error instanceof Error) {
    if (error.message.includes('URL')) {
      return { error: error.message, status: 400 };
    }
    if (error.message.includes('transcript')) {
      return { error: error.message, status: 404 };
    }
    if (error.message.includes('timeout')) {
      return { error: 'Request timed out. Please try again.', status: 408 };
    }
  }
  
  return { 
    error: 'An unexpected error occurred', 
    status: 500 
  };
} 