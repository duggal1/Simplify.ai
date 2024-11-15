import { PluggableList, Processor } from 'unified';
// @ts-ignore
import rehypeAddClasses from 'rehype-add-classes';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { transformerCopyButton } from '@rehype-pretty/transformers';
import { unified } from 'unified';

interface PrettyCodeOptions {
  theme: string;
  transformers: any[];
}

// Modern, professional styling with enhanced visual hierarchy and micro-interactions
const cssClasses = {
  'h1': 'text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-[1.02] transform transition-all duration-300 ease-out',
  'h2': 'text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-12 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hover:scale-[1.01] transform transition-all duration-300',
  'h3': 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-10 bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent hover:scale-[1.01] transform transition-all duration-300',
  'p': 'text-xl md:text-2xl leading-relaxed mb-8 text-slate-700 tracking-normal font-normal hover:text-slate-900 transition-colors duration-300 hover:translate-x-2',
  'a': 'text-indigo-600 hover:text-purple-600 underline decoration-2 underline-offset-4 transition-all duration-300 font-medium hover:decoration-purple-400',
  'ul': 'list-none space-y-6 mb-12 bg-gradient-to-br from-white to-slate-50/90 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300',
  'ol': 'list-decimal list-inside space-y-6 mb-12 bg-gradient-to-br from-white to-slate-50/90 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300',
  'li': 'flex items-center space-x-4 text-slate-700 font-normal hover:text-slate-900 transition-all duration-300 text-lg md:text-xl hover:translate-x-2',
  'blockquote': 'pl-8 border-l-4 border-indigo-500 my-12 text-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 py-8 px-10 rounded-2xl shadow-lg hover:shadow-xl backdrop-blur-sm hover:scale-[1.01] transform transition-all duration-300',
  'code': 'px-4 py-2 bg-slate-50 rounded-lg font-mono text-base text-slate-800 shadow-sm hover:shadow transition-all duration-300',
  'pre': 'rounded-2xl shadow-lg overflow-x-auto mb-12 bg-gradient-to-br from-slate-50 to-white p-8 border border-slate-100 hover:shadow-xl transition-all duration-300',
};

export default async function markdownToHtml(markdown: string): Promise<string> {
  const prettyCodeOptions: PrettyCodeOptions = {
    theme: 'github-light',
    transformers: [
      transformerCopyButton({
        visibility: 'always',
        feedbackDuration: 1500,
      }),
    ],
  };

  const result = await (unified() as Processor)
    .use(remarkParse as any)
    .use(remarkRehype as any, { allowDangerousHtml: true })
    .use(rehypeSlug as any)
    .use(rehypeAutolinkHeadings as any)
    .use(rehypePrettyCode as any, prettyCodeOptions)
    .use(rehypeAddClasses as any, cssClasses)
    .use(rehypeStringify as any)
    .process(markdown);

  const htmlContent = String(result);

  return `
    <div class="min-h-screen bg-gradient-to-br from-white via-slate-50/50 to-white">
      <div class="w-full max-w-[100ch] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <article class="prose prose-xl max-w-none">
          <div class="bg-white/80 rounded-3xl shadow-2xl ring-1 ring-slate-100/50 px-6 py-16 sm:px-12 lg:px-16 backdrop-blur-xl hover:shadow-3xl transition-all duration-500">
            ${htmlContent}
          </div>
        </article>
      </div>
      <style>
        .prose :where(ul > li):not(:where([class~="not-prose"] *))::before {
          content: "→";
          color: #6366f1;
          font-weight: 500;
          margin-right: 1rem;
          transition: all 0.3s ease;
        }
        
        .prose :where(ul > li):not(:where([class~="not-prose"] *)):hover::before {
          transform: translateX(6px);
          color: #4f46e5;
        }

        .prose :where(h1, h2, h3) {
          scroll-margin-top: 100px;
          transition: all 0.3s ease;
        }

        .prose :where(code):not(:where([class~="not-prose"] *)) {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular;
          letter-spacing: -0.25px;
        }

        .prose :where(pre):not(:where([class~="not-prose"] *)) {
          background: linear-gradient(135deg, #fafafa 0%, #f8fafc 100%);
          border-radius: 1rem;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .prose :where(pre):not(:where([class~="not-prose"] *)):hover {
          transform: translateY(-2px);
        }

        .prose :where(a):not(:where([class~="not-prose"] *)) {
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
          transition: all 0.3s ease;
        }

        .prose :where(blockquote):not(:where([class~="not-prose"] *)) {
          font-style: normal;
          border-image: linear-gradient(to bottom, #6366f1, #8b5cf6) 1;
          transition: all 0.3s ease;
        }

        .prose img {
          border-radius: 1rem;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .prose img:hover {
          transform: scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
        }

        @media (max-width: 640px) {
          .prose { font-size: 1.125rem; }
        }

        @media (min-width: 768px) {
          .prose { font-size: 1.25rem; }
        }

        @media (min-width: 1024px) {
          .prose { font-size: 1.3125rem; }
        }

        .prose * {
          transition: all 0.3s ease;
        }
      </style>
    </div>
  `;
}