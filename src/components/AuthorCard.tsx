'use client';

import Image from 'next/image';
import { PostAuthor } from '@/types/blog';

interface AuthorCardProps {
  author: PostAuthor;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-purple-500/40">
          <Image
            src={author.avatar}
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{author.name}</h3>
          {author.role && (
            <p className="text-gray-400">{author.role}</p>
          )}
        </div>
      </div>
      
      {author.bio && (
        <p className="mt-4 text-gray-300">{author.bio}</p>
      )}
      
      {author.social && (
        <div className="mt-4 flex space-x-4">
          {author.social.github && (
            <a
              href={`https://github.com/${author.social.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          )}
          {author.social.twitter && (
            <a
              href={`https://twitter.com/${author.social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
          )}
          {author.social.linkedin && (
            <a
              href={author.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  );
}