'use client';

import Image from 'next/image';
import { useState } from 'react';

interface TechStack {
  name: string;
  version: string;
  icon: string;
  url: string;
}

export default function TechStackList({ stack }: { stack: TechStack[] }) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <div className="my-12 relative overflow-hidden rounded-3xl bg-purple-900 p-8 shadow-lg border border-purple-500">
      <div className="relative">
        <h2 className="mb-8 text-3xl font-black text-center text-white">
          Tech Stack
        </h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((tech) => (
            <a
              key={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
              className="group relative overflow-hidden rounded-2xl bg-white p-0.5 shadow-2xl transition-all duration-500"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white p-6 border border-white/10">
                <div className="relative flex items-center gap-6">
                  <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-xl">
                    <div className="relative h-10 w-10">
                      <Image
                        src={tech.icon}
                        alt={tech.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-purple-800">
                      {tech.name}
                    </span>
                    <span className="text-sm font-medium text-purple-300">
                      v{tech.version}
                    </span>
                  </div>
                </div>

                {hoveredTech === tech.name && (
                  <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
                    View Documentation
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}