import { Readable } from 'stream';

export async function streamBuffer(input: any): Promise<string> {
  if (!input) return '';

  try {
    // Handle ReadableStream
    if (input instanceof ReadableStream) {
      const reader = input.getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      return Buffer.concat(chunks).toString('utf-8');
    }

    // Handle Node.js Readable streams
    if (input instanceof Readable) {
      const chunks: Buffer[] = [];
      
      for await (const chunk of input) {
        chunks.push(Buffer.from(chunk));
      }
      
      return Buffer.concat(chunks).toString('utf-8');
    }

    // Handle Blob/File objects
    if (input instanceof Blob) {
      return await input.text();
    }

    // Handle ArrayBuffer
    if (input instanceof ArrayBuffer) {
      return new TextDecoder().decode(input);
    }

    // Handle other types
    return String(input);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Stream processing error:', error);
      throw new Error(`Failed to process stream: ${error.message}`);
    } else {
      console.error('Stream processing error:', error);
      throw new Error('Failed to process stream: Unknown error');
    }
  }
}