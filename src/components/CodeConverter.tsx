'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Code2, FileCode, Loader2, Copy, Download, RefreshCw,
  Link as LinkIcon, AlertCircle, CheckCircle
} from 'lucide-react';
import Confetti from 'react-confetti';

interface ConversionResult {
  success: boolean;
  code?: string;
  results?: string[];
  language: string;
  error?: string;
  blocksFound?: number;
  timestamp?: string;
}

const LANGUAGES = [
  { id: 'nextjs', name: 'Next.js', icon: '▲', extension: '.tsx' },
  { id: 'typescript', name: 'TypeScript', icon: '⚡', extension: '.tsx' },
  { id: 'react', name: 'React', icon: '⚛️', extension: '.tsx' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨', extension: '.js' },
  { id: 'python', name: 'Python', icon: '🐍', extension: '.py' },
  { id: 'java', name: 'Java', icon: '☕', extension: '.java' }
] as const;

const loadingMessages = [
  "✨ AI magic in progress...",
  "🎯 Almost there, hold tight!",
  "🚀 Converting your code...",
  "🌟 Sprinkling some AI dust...",
  "🎨 Making your code beautiful..."
];

export function CodeConverter() {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<typeof LANGUAGES[number]['id']>('typescript');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Reset copied state when result changes
  useEffect(() => {
    setCopied(false);
  }, [result]);

  // Validate HTTPS URL
  const isValidUrl = useCallback((urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'https:';
    } catch {
      return false;
    }
  }, []);

  const handleConvert = async () => {
    if (!code && !url) {
      toast.error('Please enter either code or a URL');
      return;
    }

    if (url && !isValidUrl(url)) {
      toast.error('Please enter a valid HTTPS URL');
      return;
    }

    setLoading(true);
    setResult(null);
    setLoadingMessageIndex(0);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('/api/code-convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          url,
          targetLanguage: selectedLanguage,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data: ConversionResult = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Conversion failed');
      }

      setResult(data);
      
      if (data.blocksFound && data.blocksFound > 0) {
        toast.success(`Successfully converted ${data.blocksFound} code blocks!`);
      } else {
        toast.success('Code converted successfully!');
      }

    } catch (error) {
      console.error('Conversion error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast.error('Request timed out. Please try again.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to convert code');
      }
      
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy code');
    }
  };

  const downloadCode = useCallback((code: string, language: string) => {
    try {
      const extension = LANGUAGES.find(lang => lang.id === language)?.extension || '.txt';
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Code downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download code');
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <LinkIcon className="w-4 h-4" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter HTTPS URL to extract code"
                className="w-full p-2 rounded-md border text-slate-950 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4" />
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Or paste your code here"
                className="w-full h-[300px] p-2 rounded-md border text-slate-950 border-gray-300 dark:border-gray-700 font-mono focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex flex-wrap gap-3 p-4 backdrop-blur-lg">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                disabled={loading}
                className={`group relative px-6 py-3 rounded-lg flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 
                  ${selectedLanguage === lang.id
                    ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-300 ring-offset-2 ring-offset-purple-100'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-800 text-gray-700 dark:text-gray-200 shadow-md hover:shadow-xl'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  backdrop-blur-sm hover:backdrop-blur-md
                  motion-safe:hover:-translate-y-0.5
                  border border-transparent hover:border-purple-500/20
                  active:scale-95`}
              >
                <span className="text-xl transform transition-transform group-hover:scale-125 group-hover:rotate-12">{lang.icon}</span>
                <span className="font-semibold tracking-wide">{lang.name}</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </button>
            ))}
          </div>

          <button
            onClick={handleConvert}
            disabled={loading || (!code && !url)}
            className="w-full py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all 
              bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 
              hover:from-purple-700 hover:via-pink-600 hover:to-blue-700
              text-white font-bold
              shadow-[0_0_20px_rgba(168,85,247,0.5)]
              hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]
              animate-gradient-x
              border border-purple-400/30
              backdrop-blur-sm
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:shadow-none
              focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            {loading ? (
              <motion.div
                className="flex items-center space-x-2"
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="animate-pulse">{loadingMessages[loadingMessageIndex]}</span>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Convert Code</span>
              </motion.div>
            )}
          </button>
        </div>

        {/* Result Section */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => copyToClipboard(result.results?.[0] || result.code || '')}
                  className="p-2 rounded-md bg-gray-100  text-slate-900 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => downloadCode(result.results?.[0] || result.code || '', result.language)}
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <pre className="h-[400px] p-4 rounded-md bg-gray-100 dark:bg-gray-800 overflow-auto">
                <code className="text-sm font-mono text-slate-900">
                  {result.results?.[0] || result.code || 'No code generated'}
                </code>
              </pre>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[400px] rounded-md bg-gray-100 dark:bg-gray-800"
            >
              <div className="text-center text-slate-900">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>Gemini content will render here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 