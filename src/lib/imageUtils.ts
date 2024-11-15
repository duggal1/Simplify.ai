import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const defaultImage = '/images/default-post-image.jpg';

export function validateImage(imagePath: string): string {
  // If no image provided, return default
  if (!imagePath) return defaultImage;

  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Check if file exists
  const fullPath = path.join(publicDir, normalizedPath);
  
  if (fs.existsSync(fullPath)) {
    return normalizedPath;
  }

  console.warn(`Image not found: ${fullPath}, using default image`);
  return defaultImage;
} 