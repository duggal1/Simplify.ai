import React from 'react';
import { motion } from 'framer-motion';

interface BlogPostDisplayProps {
  content: string;
}

export const BlogPostDisplay: React.FC<BlogPostDisplayProps> = ({ content }) => {
  return (
    <article className="
      prose prose-lg max-w-none
      px-8 py-6
      bg-gradient-to-b from-white to-gray-50
      rounded-2xl shadow-lg
      border border-gray-100
      backdrop-filter backdrop-blur-lg
      hover:shadow-xl transition-all duration-500
    ">
      {content.split('\n\n').map((block, index) => {
        // Heading detection and styling
        if (block.startsWith('#')) {
          const level = block.match(/^#+/)?.[0].length || 1;
          const text = block.replace(/^#+\s/, '');
          
          const headingClasses = {
            1: "text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent animate-gradient",
            2: "text-3xl font-bold mt-8 mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent",
            3: "text-2xl font-semibold mt-6 mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent",
            4: "text-xl font-medium mt-4 mb-2 text-gray-800",
          }[level] || "text-lg font-medium text-gray-800";

          return (
            <h1 key={index} className={`
              ${headingClasses}
              hover:scale-[1.01] transform
              transition-all duration-300
              cursor-default
              text-shadow-sm
            `}>
              {text}
            </h1>
          );
        }

        // List detection and styling
        if (block.match(/^[-*]\s/)) {
          return (
            <ul key={index} className="
              space-y-2 my-4
              list-none
              [&>li]:relative [&>li]:pl-6
              [&>li]:before:content-['•']
              [&>li]:before:absolute [&>li]:before:left-0
              [&>li]:before:text-purple-500
              [&>li]:before:font-bold
            ">
              {block.split('\n').map((item, i) => (
                <li key={i} className="
                  text-gray-700
                  hover:text-gray-900
                  transition-colors duration-200
                  leading-relaxed
                ">
                  {item.replace(/^[-*]\s/, '')}
                </li>
              ))}
            </ul>
          );
        }

        // Blockquote detection and styling
        if (block.startsWith('>')) {
          return (
            <blockquote key={index} className="
              border-l-4 border-purple-500
              pl-6 py-2 my-6
              bg-gradient-to-r from-purple-50 to-transparent
              rounded-r-lg
              italic
              text-gray-700
              hover:border-l-6
              transition-all duration-300
              shadow-sm
            ">
              {block.replace(/^>\s/, '')}
            </blockquote>
          );
        }

        // Code block detection and styling
        if (block.match(/^```/)) {
          return (
            <pre key={index} className="
              bg-gray-900
              text-gray-100
              rounded-xl
              p-6
              my-6
              overflow-x-auto
              shadow-xl
              border border-gray-800
              hover:border-purple-500
              transition-all duration-300
            ">
              <code className="font-mono text-sm">
                {block.replace(/^```\w*\n/, '').replace(/```$/, '')}
              </code>
            </pre>
          );
        }

        // Regular paragraph styling
        return (
          <p key={index} className="
            text-gray-700
            leading-relaxed
            my-4
            hover:text-gray-900
            transition-colors duration-200
            first-letter:text-2xl
            first-letter:font-semibold
            first-letter:text-purple-600
            first-letter:mr-1
            first-letter:float-left
          ">
            {block}
          </p>
        );
      })}
    </article>
  );
}; 