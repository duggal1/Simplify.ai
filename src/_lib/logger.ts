export interface Logger {
  info: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  error: (message: string, meta?: any) => void;
}

export const Logger: Logger = {
  info: (message: string, meta?: any) => {
    console.info(`[INFO] ${message}`, meta);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${message}`, meta);
  }
};
