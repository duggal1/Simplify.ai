import * as React from 'react';

interface WelcomeEmailProps {
  email: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email }) => (
  <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-xl">
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Welcome to SIMPLIFY.AI! 🚀
      </h1>
      
      <p className="text-lg text-gray-700">
        Hey {email}! I&apos;m Duggal, CEO of SIMPLIFY.AI
      </p>

      <p className="text-gray-600 leading-relaxed">
        I&apos;m thrilled to personally welcome you to our innovative AI community. You&apos;re now part of something extraordinary - a platform that&apos;s revolutionizing how we interact with AI.
      </p>

      <div className="bg-white/50 p-6 rounded-xl backdrop-blur-sm border border-indigo-100">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">
          What&apos;s Next? 🎯
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-indigo-500">→</span>
            Exclusive AI insights straight to your inbox
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-500">→</span>
            Early access to new features
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-500">→</span>
            Special member-only content
          </li>
        </ul>
      </div>

      <p className="text-sm text-gray-500 italic">
        Stay tuned for some amazing updates coming your way!
      </p>
    </div>
  </div>
);