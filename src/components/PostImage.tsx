'use client';

import Image from 'next/image';
import { useState } from 'react';

interface PostImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PostImage = ({ src, alt, className = '' }: PostImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={1200}
        height={630}
        priority
        className="object-cover w-full h-full transition duration-300 ease-in-out transform hover:scale-110 rounded-lg"
        onError={() => setImgSrc('/images/default-post-image.jpg')}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 transition-opacity duration-300 ease-in-out hover:opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-lg font-bold bg-black bg-opacity-50 p-2 rounded-lg">{alt}</span>
      </div>
    </div>
  );
};

export default PostImage; 