'use client';

import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  AlertCircle,
  FileSpreadsheet,
  FileJson,
  Code2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  BarChart2,
  Download,
  Copy,
  CheckCircle,
  LineChart,
  Target,
  AlertTriangle,
  Database,
  TrendingUp,
  Calendar,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import confetti from 'canvas-confetti';

// logically enhaced and better debuggings
interface FileIconProps {
  filename: string;
  className?: string;
}
//
const FileIcon: React.FC<FileIconProps> = ({ filename, className }) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <FileText className={`${className || 'w-6 h-6'} text-red-500`} />;
    case 'xlsx':
    case 'xls':
    case 'xlsm':
    case 'xlsb':
      return <FileSpreadsheet className={`${className || 'w-6 h-6'} text-green-500`} />;
    case 'csv':
      return <FileJson className={`${className || 'w-6 h-6'} text-blue-500`} />;
    default:
      return <FileText className={`${className || 'w-6 h-6'} text-gray-500`} />;
  }
};

// Add new CopyButton component
const CopyButton: React.FC<{ content: string; variant?: 'primary' | 'secondary' }> = ({ content, variant = 'primary' }) => {
  const [copied, setCopied] = useState(false);

  const triggerConfetti = () => {
    // Primary burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#9333EA', '#6366F1', '#A855F7', '#EC4899', '#8B5CF6'],
      startVelocity: 45,
      gravity: 0.8,
      shapes: ['circle', 'square'],
      ticks: 400,
      zIndex: 9999,
    });

    // Secondary bursts
    setTimeout(() => {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7, x: 0.4 },
        colors: ['#9333EA', '#6366F1'],
        startVelocity: 35,
      });
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7, x: 0.6 },
        colors: ['#A855F7', '#EC4899'],
        startVelocity: 35,
      });
    }, 200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      triggerConfetti();
      toast.success('Content copied!', {
        duration: 2000,
        className: 'super-toast'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        group flex items-center space-x-2 px-3 py-2 rounded-lg
        transform transition-all duration-200
        ${variant === 'primary' 
          ? 'bg-purple-600/90 hover:bg-purple-500 active:bg-purple-700'
          : 'bg-white/90 hover:bg-white active:bg-white/80'}
        hover:scale-105 active:scale-95 hover:shadow-lg
      `}
    >
      {copied ? (
        <CheckCircle className={`w-4 h-4 ${variant === 'primary' ? 'text-white' : 'text-purple-600'} animate-bounce`} />
      ) : (
        <Copy className={`w-4 h-4 ${variant === 'primary' ? 'text-white' : 'text-purple-600'}`} />
      )}
      <span className={`text-sm font-medium ${variant === 'primary' ? 'text-white' : 'text-purple-600'}`}>
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
};
// Enhanced AnalyticsCard component for subsections
const AnalyticsCard: React.FC<{ 
  title: string;
  content: any;
  type: 'primary' | 'deep';
}> = ({ title, content, type }) => {
  const downloadAnalytics = () => {
    try {
      const formattedContent = JSON.stringify(content, null, 2);
      const blob = new Blob([formattedContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-analysis.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Analysis downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download analysis');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {/* Header */}
      <div className={`p-6 border-b border-purple-100 bg-gradient-to-r 
        ${type === 'primary' ? 'from-purple-50 to-blue-50' : 'from-blue-50 to-purple-50'}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-purple-900">{title}</h3>
          <button
            onClick={downloadAnalytics}
            className="p-2 rounded-lg bg-white/50 hover:bg-white transition-all"
          >
            <Download className="w-5 h-5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Summary with Copy Button */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-purple-900">Summary</h4>
            <CopyButton content={content.summary || ''} variant="secondary" />
          </div>
          <p className="text-gray-700 leading-relaxed">
            {content.summary || 'Analysis in progress...'}
          </p>
        </div>

        {/* Key Points with Copy Button */}
        {content.key_points?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-purple-900">Key Points</h4>
              <CopyButton content={content.key_points.join('\n')} variant="secondary" />
            </div>
            <ul className="space-y-2">
              {content.key_points.map((point: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metrics with Copy Button */}
        {Object.keys(content.metrics || {}).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-purple-900">Metrics</h4>
              <CopyButton 
                content={Object.entries(content.metrics)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')} 
                variant="secondary" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(content.metrics).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-700 font-medium">{key}</p>
                  <p className="text-lg text-purple-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations with Copy Button */}
        {content.recommendations?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-purple-900">Recommendations</h4>
              <CopyButton content={content.recommendations.join('\n')} variant="secondary" />
            </div>
            <ul className="space-y-2">
              {content.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced AnalyticsDisplay component
const AnalyticsDisplay: React.FC<{ data: any }> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('primary');

  return (
    <div className="bg-white/90 rounded-3xl p-8 space-y-12 shadow-xl backdrop-blur-lg w-full min-w-[800px] overflow-x-auto">
      <Tabs defaultValue="primary" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 gap-4 p-4 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl sticky top-0 z-10">
          <TabsTrigger value="primary" className="text-lg font-semibold">
            Primary Analysis
          </TabsTrigger>
          <TabsTrigger value="deep" className="text-lg font-semibold">
            Deep Analysis
          </TabsTrigger>
        </TabsList>

        {/* Primary Analysis Content */}
        <TabsContent value="primary" className="space-y-16">
          <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-12 min-w-[1200px]">
            {data?.primary && Object.entries(data.primary).map(([key, value]: [string, any]) => (
              <AnalyticsCard
                key={key}
                title={key}
                content={value}
                type="primary"
              />
            ))}
          </div>
        </TabsContent>

        {/* Deep Analysis Content */}
        <TabsContent value="deep" className="space-y-16">
          <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-12 min-w-[1200px]">
            {data?.deep && Object.entries(data.deep).map(([key, value]: [string, any]) => (
              <AnalyticsCard
                key={key}
                title={key}
                content={value}
                type="deep"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to generate metrics from content
const generateMetrics = (content: string): string[] => {
  // Extract key metrics from the content
  const metrics = content
    .split('.')
    .filter(sentence => 
      sentence.includes('%') || 
      sentence.includes('$') || 
      /\d+/.test(sentence)
    )
    .slice(0, 5)
    .map(m => m.trim());
  
  return metrics.length > 0 ? metrics : ['No metrics available'];
};

//NEW CHANGES
const FileProcessor: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const abortController = useRef<AbortController>();

  // Add batch processing status
  const [batchProgress, setBatchProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  // Advanced file upload handling with validation
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const validFiles = acceptedFiles.filter(file => {
        const isValid = /\.(xlsx|xls|xlsm|xlsb|csv|pdf)$/i.test(file.name);
        if (!isValid) {
          toast.error(`Invalid file type: ${file.name}`);
        }
        return isValid;
      });

      if (validFiles.length > 20) {
        toast.warning('Maximum 20 files allowed at once');
        validFiles.length = 20;
      }

      setFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} files`);
    } catch (error) {
      console.error('Drop error:', error);
      toast.error('Error adding files');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'],
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12': ['.xlsb'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 20
  });

  // Process files with progress tracking and cancellation
  const processFiles = async () => {
    if (!files.length) {
      toast.error('No files selected');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/file-process', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        toast.success(`Successfully processed ${data.successfulFiles} files`);
      } else {
        throw new Error(data.error || 'Failed to process files');
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process files');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add missing toggleResult function
  const toggleResult = (filename: string) => {
    setExpandedResults(prev => {
      const next = new Set(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      return next;
    });
  };

  // Add missing getFileType function
  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'xlsx':
      case 'xls':
      case 'xlsm':
      case 'xlsb':
        return 'Excel Spreadsheet';
      case 'csv':
        return 'CSV File';
      default:
        return 'Unknown Type';
    }
  };

  const [combinedAnalytics, setCombinedAnalytics] = useState<string>('');

  // Enhanced download functionality with proper typing and error handling
  const downloadAllData = (processedData: any, analytics: any) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fullData = {
        processedData,
        analytics,
        exportedAt: timestamp,
        version: '1.0'
      };
      
      const formattedContent = JSON.stringify(fullData, null, 2);
      const blob = new Blob([formattedContent], { 
        type: 'application/json;charset=utf-8'
      });
      
      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complete-analysis-${timestamp}.json`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Successfully exported complete analysis!', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analysis. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-xl p-12 transition-all
          ${isDragActive 
            ? 'bg-gradient-to-br from-purple-100/50 to-blue-100/50 border-purple-400' 
            : 'bg-white/80 border-purple-200/50'}
          border-2 border-dashed backdrop-blur-sm
          hover:bg-purple-50/50 hover:border-purple-300
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <Upload className="w-16 h-16 text-purple-300" />
            </div>
            <Upload className="w-16 h-16 mx-auto text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-medium text-gray-700">
              Drop files here or click to browse
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Support for multiple files (up to 20): PDF, Excel (.xlsx, .xls, .xlsm, .xlsb), CSV
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <h3 className="font-semibold">Selected Files:</h3>
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center  text-slate-900 justify-between p-2 bg-gray-50 rounded"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Button */}
      <div className="flex justify-center">
        <button
          onClick={processFiles}
          disabled={isProcessing || !files.length}
          className={`
            px-6 py-3 rounded-lg font-semibold text-white
            ${isProcessing
              ? 'bg-gray-400'
              : 'bg-purple-600 hover:bg-purple-700'}
            transition-all
          `}
        >
          {isProcessing ? (
            <span className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </span>
          ) : (
            'Process Files'
          )}
        </button>
      </div>

      {/* Results Display */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Combined Analytics Card */}
            {results.length > 1 && (
              <Card className="bg-gradient-to-r from-purple-100 to-blue-100 p-6">
                <h3 className="text-xl font-semibold mb-4">Combined Analysis</h3>
                <AnalyticsDisplay data={combinedAnalytics} />
              </Card>
            )}

            {/* Individual File Results */}
            {results.map((result) => (
              <Card
                key={result.filename}
                className="bg-white/90 backdrop-blur-lg border-purple-100/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
              >
                <div className="border-b border-purple-100/20">
                  <div className="p-6 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <FileIcon filename={result.filename} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{result.filename}</h3>
                        <Badge variant="outline" className="bg-white/50 text-purple-700">
                          {getFileType(result.filename)}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleResult(result.filename)}
                      className="p-2 hover:bg-purple-50 rounded-full transition-colors"
                    >
                      {expandedResults.has(result.filename) ? (
                        <ChevronUp className="w-5 h-5 text-purple-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-purple-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* JSON Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center space-x-3 text-lg">
                        <FileJson className="w-5 h-5 text-purple-600" />
                        <span>Data Structure</span>
                      </h4>
                      <div className="flex items-center space-x-3">
                        <CopyButton content={JSON.stringify(result.processedData, null, 2)} />
                        <button
                          onClick={() => downloadAllData(result.processedData, result.analytics)}
                          className="group flex items-center space-x-2 px-3 py-2 rounded-lg 
                            bg-purple-600/90 hover:bg-purple-500 active:bg-purple-700 
                            transform transition-all duration-200 hover:scale-105 
                            active:scale-95 hover:shadow-lg"
                        >
                          <Download className="w-4 h-4 text-white group-hover:animate-bounce" />
                          <span className="text-sm font-medium text-white">Download</span>
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-6 shadow-inner relative min-h-[600px]">
                      <pre className="text-sm font-mono text-purple-100 overflow-auto max-h-[550px]">
                        {JSON.stringify(result.processedData, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center space-x-3 text-lg">
                      <BarChart2 className="w-5 h-5 text-purple-600" />
                      <span>Intelligent Analysis</span>
                    </h4>
                    <AnalyticsDisplay data={result.analytics} />
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
//new features
export default FileProcessor;
