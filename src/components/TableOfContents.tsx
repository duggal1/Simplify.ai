'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const headings = Array.from(new DOMParser().parseFromString(content, 'text/html').querySelectorAll('h2, h3, h4'));
    setToc(headings.map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1)),
    })));
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting && setActiveId(entry.target.id));
    }, { rootMargin: '-20% 0% -35% 0%' });

    const headings = document.querySelectorAll('h2, h3, h4');
    headings.forEach(heading => observer.observe(heading));

    return () => headings.forEach(heading => observer.unobserve(heading));
  }, []);

  return (
    <nav className="sticky top-24 mb-8 hidden lg:block">
      <div className="relative rounded-3xl bg-purple-900 p-8 shadow-lg border border-purple-500">
        <div className="relative">
          <h2 className="mb-6 text-2xl font-black text-purple-400">
            Table of Contents
          </h2>
          <div className="space-y-3">
            {toc.map(item => (
              <div key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
                  className={`flex items-center gap-2 rounded-xl py-2 px-4 transition-all duration-300
                    ${activeId === item.id 
                      ? 'font-semibold text-purple-200'
                      : 'text-gray-400 hover:text-gray-200'
                    }`}
                  onClick={e => {
                    e.preventDefault();
                    document.querySelector(`#${item.id}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="relative z-10 text-sm">
                    {item.text}
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}