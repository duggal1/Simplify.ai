"use client"

import { PostAuthor } from '@/types/post';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';

interface PostMetaProps {
  author: PostAuthor;
  date: string;
  readTime: string;
  wordCount?: number;
}

export default function PostMeta({ author, date, readTime, wordCount }: PostMetaProps) {
  if (!author?.avatar || !author?.name) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
      <div className="flex items-center space-x-6 px-6 py-3 bg-white rounded-2xl border border-gray-300 shadow-md">
        <div className="flex items-center group">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <Image
              src={author.avatar}
              alt={author.name}
              width={32}
              height={32}
              className="relative rounded-full ring-2 ring-gray-200 group-hover:ring-gray-400 transition-all duration-300"
            />
          </div>
          <span className="ml-3 font-medium text-gray-800 group-hover:text-gray-600 transition-all duration-300">
            {author.name}
          </span>
        </div>
        
        <span className="text-gray-400">•</span>
        
        <time 
          dateTime={date}
          className="text-sm font-medium text-gray-600 transition-all duration-300"
        >
          {format(parseISO(date), 'LLLL d, yyyy')}
        </time>
        
        <span className="text-gray-400">•</span>
        
        <span className="px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full border border-blue-700 hover:border-blue-600 transition-all duration-300">
          {readTime} read
        </span>
        
        {wordCount && (
          <>
            <span className="text-gray-400">•</span>
            <span className="px-3 py-1 text-sm font-medium text-white bg-purple-500 rounded-full border border-purple-700 hover:border-purple-600 transition-all duration-300">
              {wordCount} words
            </span>
          </>
        )}
      </div>
    </div>
  );
}