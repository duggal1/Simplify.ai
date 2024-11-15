'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  Loader2, 
  FileJson, 
  Code2, 
  RefreshCw, 
  Upload, 
  Download,
  Clipboard,
  CheckCircle,
  Activity,
  Clock,
  Minimize2,
  Zap,
  Copy,
  Check
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import confetti from 'canvas-confetti'
import { MetricCard } from "./MetricCard"
import { FileUpload } from './FileUpload'

import yaml from 'js-yaml'
import { parse as parseToml } from '@iarna/toml'
import { parse as parseCsv } from 'csv-parse/sync'

//enhanced validations
interface MetricsData {
  totalConversions: number;
  successfulConversions: number;
  averageProcessingTime: number;
  averageComplexityScore: number;
  averageCompressionRatio: number;
  overallSuccessRate: number;
  averageDataQuality: number;
  averageOutputQuality: number;
  totalDataProcessed: number;
  apiEfficiency: number;
}

const DEFAULT_FORMAT = `{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" },
    "email": { "type": "string", "format": "email" },
    "interests": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}`

// Enhanced XML/Document serializer with proper type checking
const serializeXMLToObj = (node: Node): any => {
  // Handle text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() || ''
    return text.length > 0 ? text : null
  }

  // Handle element nodes
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    const result: any = {}

    // Handle attributes
    if (element.hasAttributes()) {
      result['@attributes'] = {}
      Array.from(element.attributes).forEach(attr => {
        result['@attributes'][attr.name] = attr.value
      })
    }

    // Handle child nodes
    Array.from(element.childNodes).forEach(child => {
      const childResult = serializeXMLToObj(child)
      if (childResult !== null) {
        const tagName = child.nodeName
        if (result[tagName]) {
          if (Array.isArray(result[tagName])) {
            result[tagName].push(childResult)
          } else {
            result[tagName] = [result[tagName], childResult]
          }
        } else {
          result[tagName] = childResult
        }
      }
    })

    return Object.keys(result).length ? result : null
  }

  return null
}

// Enhanced file content parser
const parseFileContent = async (
  content: string | ArrayBuffer | null, 
  fileType: string,
  readMethod: string
): Promise<{ parsedContent: any; contentType: string }> => {
  if (!content) {
    throw new Error('No content to parse')
  }

  let textContent: string
  if (content instanceof ArrayBuffer) {
    textContent = new TextDecoder().decode(content)
  } else {
    textContent = content
  }

  // Try all possible parsing methods
  const parsers = [
    {
      type: 'json',
      test: () => {
        try {
          return JSON.parse(textContent)
        } catch {
          return null
        }
      }
    },
    {
      type: 'yaml',
      test: () => {
        try {
          return yaml.load(textContent)
        } catch {
          return null
        }
      }
    },
    {
      type: 'toml',
      test: () => {
        try {
          return parseToml(textContent)
        } catch {
          return null
        }
      }
    },
    {
      type: 'csv',
      test: () => {
        try {
          return parseCsv(textContent, {
            columns: true,
            skip_empty_lines: true,
            cast: true,
            relaxColumnCount: true,
            trim: true
          })
        } catch {
          return null
        }
      }
    },
    {
      type: 'xml',
      test: () => {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(textContent, 'text/xml')
          if (!doc.querySelector('parsererror')) {
            return serializeXMLToObj(doc.documentElement)
          }
          return null
        } catch {
          return null
        }
      }
    },
    {
      type: 'html',
      test: () => {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(textContent, 'text/html')
          return {
            title: doc.title,
            headings: Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'))
              .map(h => ({ level: h.tagName, text: h.textContent?.trim() })),
            paragraphs: Array.from(doc.querySelectorAll('p'))
              .map(p => p.textContent?.trim())
              .filter(Boolean),
            links: Array.from(doc.querySelectorAll('a'))
              .map(a => ({ 
                text: a.textContent?.trim(), 
                href: a.getAttribute('href') 
              })),
            structure: serializeXMLToObj(doc.body)
          }
        } catch {
          return null
        }
      }
    }
  ]

  // Try each parser
  for (const parser of parsers) {
    const result = parser.test()
    if (result !== null) {
      return { parsedContent: result, contentType: parser.type }
    }
  }

  // Fallback to structured text analysis
  const structuredContent = analyzeTextContent(textContent)
  return { 
    parsedContent: structuredContent, 
    contentType: 'structured-text' 
  }
}

// Helper function to analyze text content
const analyzeTextContent = (content: string) => {
  const lines = content.split('\n')
  const patterns = {
    keyValue: /^[\w-]+\s*[:=]\s*.+$/,
    list: /^[-*+•]\s+.+$/,
    numberedList: /^\d+[.)]\s+.+$/,
    heading: /^#{1,6}\s+.+$|^[=-]{3,}$/,
    table: /^\|.+\|$/,
    codeBlock: /^```[\s\S]*?```$/,
    url: /^https?:\/\/\S+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }

  return {
    structure: {
      lines: lines.length,
      patterns: Object.entries(patterns).reduce((acc, [key, regex]) => ({
        ...acc,
        [key]: lines.filter(l => regex.test(l)).length
      }), {}),
      statistics: {
        characters: content.length,
        words: content.split(/\s+/).filter(Boolean).length,
        paragraphs: content.split(/\n\s*\n/).filter(Boolean).length
      }
    },
    content: {
      preview: content.slice(0, 1000),
      fullText: content
    }
  }
}

const calculateMetrics = (input: string, result: any) => {
  // Calculate input and output sizes in bytes
  const inputSize = new TextEncoder().encode(input).length;
  const outputSize = new TextEncoder().encode(JSON.stringify(result)).length;

  return {
    inputType: detectInputType(input),
    outputFormat: 'json',
    contentSize: inputSize,
    processingTime: Math.floor(Math.random() * 1000) + 100, // Simulated processing time
    complexityScore: calculateComplexity(input),
    compressionRatio: calculateCompressionRatio(inputSize, outputSize), // Fixed: passing numbers instead of strings
    success: true,
    schemaValidation: true,
    apiCalls: 1
  };
};

export function JsonConverter() {
  const { user } = useUser()
  const [input, setInput] = useState('')
  const [format, setFormat] = useState(DEFAULT_FORMAT)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState<MetricsData>({
    totalConversions: 0,
    successfulConversions: 0,
    averageProcessingTime: 0,
    averageComplexityScore: 0,
    averageCompressionRatio: 0,
    overallSuccessRate: 0,
    averageDataQuality: 0,
    averageOutputQuality: 0,
    totalDataProcessed: 0,
    apiEfficiency: 0
  });
  const [copied, setCopied] = useState(false)
  const [conversionStep, setConversionStep] = useState(0)

  const loadingTexts = [
    "Initializing conversion...",
    "Processing your data...",
    "Almost there...",
    "Finalizing results..."
  ]
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setConversionStep((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Fetch metrics on mount and after conversions
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      toast.error('Failed to load metrics');
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchMetrics();
    }
  }, [user?.id, fetchMetrics]);

  const handleConvert = useCallback(async () => {
    if (!input.trim() || !user) {
      toast.error('Please enter some data to convert');
      return;
    }

    const startTime = Date.now();
    setLoading(true);
    setError('');
    setResult(null);
    setConversionStep(0);

    try {
      const response = await fetch('/api/json', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.primaryEmailAddress?.emailAddress}`
        },
        body: JSON.stringify({
          data: input,
          format: JSON.parse(format),
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      setResult(data);

      // Track metrics
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          output: JSON.stringify(data),
          startTime,
          success: true,
        }),
      });

      // Refresh metrics
      await fetchMetrics();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Track failed conversion
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          startTime,
          error: err instanceof Error ? err.message : 'Unknown error',
          success: false,
        }),
      });

      toast.error('Conversion failed');
    } finally {
      setLoading(false);
    }
  }, [input, format, user, fetchMetrics]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const fileSize = (file.size / 1024 / 1024).toFixed(2)
      const fileType = file.type || file.name.split('.').pop()?.toLowerCase() || 'unknown'
      const fileName = file.name

      toast.loading(`Processing ${fileName} (${fileSize}MB)`)

      // Step 1: Try multiple reading methods
      let content: any = null
      let readMethod = 'text'

      try {
        // Try as text first
        content = await file.text()
      } catch {
        try {
          // Try as ArrayBuffer
          const buffer = await file.arrayBuffer()
          try {
            content = new TextDecoder().decode(buffer)
            readMethod = 'arrayBuffer'
          } catch {
            // If text decode fails, keep binary data
            content = Array.from(new Uint8Array(buffer))
            readMethod = 'binary'
          }
        } catch {
          // Last resort: Base64
          content = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result)
            reader.readAsDataURL(file)
          })
          readMethod = 'base64'
        }
      }

      // Step 2: Try to detect and parse content
      let parsedContent: any = null
      let contentType = 'unknown'

      const tryParse = async () => {
        // Try JSON
        try {
          parsedContent = JSON.parse(content)
          contentType = 'json'
          return true
        } catch {}

        // Try XML/HTML
        try {
          const doc = new DOMParser().parseFromString(content, 'text/html')
          if (!doc.querySelector('parsererror')) {
            parsedContent = {
              doctype: doc.doctype?.name,
              title: doc.title,
              elements: Array.from(doc.querySelectorAll('*')).map(el => ({
                tag: el.tagName.toLowerCase(),
                text: el.textContent?.trim(),
                attributes: Object.fromEntries(
                  Array.from(el.attributes).map(attr => [attr.name, attr.value])
                ),
                children: el.childNodes.length
              }))
            }
            contentType = doc.querySelector('html') ? 'html' : 'xml'
            return true
          }
        } catch {}

        // Try YAML
        try {
          parsedContent = yaml.load(content)
          contentType = 'yaml'
          return true
        } catch {}

        // Try CSV
        try {
          parsedContent = parseCsv(content, {
            columns: true,
            skip_empty_lines: true,
            cast: true,
            relaxColumnCount: true
          })
          contentType = 'csv'
          return true
        } catch {}

        // Try as structured text
        try {
          // Check for common patterns
          const lines = content.split('\n')
          const patterns = {
            keyValue: /^[\w-]+\s*[:=]\s*.+$/,
            list: /^[-*+•]\s+.+$/,
            numberedList: /^\d+[.)]\s+.+$/,
            heading: /^#{1,6}\s+.+$|^[=-]{3,}$/,
            table: /^\|.+\|$/,
            codeBlock: /^```[\s\S]*?```$/,
            url: /^https?:\/\/\S+$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          }

          const structureAnalysis = {
            hasKeyValue: lines.some((l: string) => patterns.keyValue.test(l)),
            hasList: lines.some((l: string) => patterns.list.test(l)),
            hasNumberedList: lines.some((l: string) => patterns.numberedList.test(l)),
            hasHeadings: lines.some((l: string) => patterns.heading.test(l)),
            hasTable: lines.some((l: string) => patterns.table.test(l)),
            hasCodeBlocks: content.includes('```'),
            hasUrls: lines.some((l: string) => patterns.url.test(l)),
            hasEmails: lines.some((l: string) => patterns.email.test(l))
          }

          if (Object.values(structureAnalysis).some(v => v)) {
            parsedContent = {
              structure: structureAnalysis,
              elements: {
                keyValues: lines.filter((l: string) => patterns.keyValue.test(l))
                  .map((l: { split: (arg0: RegExp) => [any, ...any[]] }) => {
                    const [key, ...values] = l.split(/[:=]/)
                    return { key: key.trim(), value: values.join('=').trim() }
                  }),
                lists: lines.filter((l: string) => patterns.list.test(l))
                  .map((l: string) => l.replace(/^[-*+•]\s+/, '')),
                numberedLists: lines.filter((l: string) => patterns.numberedList.test(l))
                  .map((l: string) => l.replace(/^\d+[.)]\s+/, '')),
                headings: lines.filter((l: string) => patterns.heading.test(l)),
                urls: lines.filter((l: string) => patterns.url.test(l)),
                emails: lines.filter((l: string) => patterns.email.test(l)),
                codeBlocks: content.match(/```[\s\S]*?```/g) || []
              },
              rawContent: content
            }
            contentType = 'structured-text'
            return true
          }
        } catch {}

        // Binary file analysis
        if (readMethod === 'binary' || readMethod === 'base64') {
          const signatures: Record<string, number[]> = {
            pdf: [0x25, 0x50, 0x44, 0x46],
            png: [0x89, 0x50, 0x4E, 0x47],
            jpg: [0xFF, 0xD8, 0xFF],
            gif: [0x47, 0x49, 0x46, 0x38],
            zip: [0x50, 0x4B, 0x03, 0x04],
            // Add more signatures as needed
          }

          const bytes = readMethod === 'binary' ? content : 
            new Uint8Array(Buffer.from(content.split(',')[1], 'base64'))

          for (const [format, signature] of Object.entries(signatures)) {
            if (signature.every((byte, i) => bytes[i] === byte)) {
              contentType = format
              parsedContent = {
                format,
                size: bytes.length,
                preview: bytes.slice(0, 32),
                encoding: readMethod
              }
              return true
            }
          }
        }

        // Default handling for unrecognized content
        parsedContent = {
          type: 'unknown',
          preview: content.slice(0, 1000),
          statistics: {
            totalLength: content.length,
            lines: content.split('\n').length,
            words: content.split(/\s+/).length,
            bytes: new TextEncoder().encode(content).length
          }
        }
        return false
      }

      await tryParse()

      // Step 3: Create final result with metadata
      const result = {
        data: parsedContent,
        metadata: {
          fileName,
          fileType,
          detectedType: contentType,
          fileSize: `${fileSize}MB`,
          readMethod,
          lastModified: new Date(file.lastModified).toISOString(),
          mimeType: file.type || 'application/octet-stream',
          parseTime: new Date().toISOString(),
          success: true
        }
      }

      setInput(JSON.stringify(result, null, 2))
      toast.success('File processed successfully!', {
        description: `Detected type: ${contentType}`
      })

    } catch (err) {
      console.error('File processing error:', err)
      toast.error('Failed to process file', {
        description: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('File downloaded successfully')
  }

  const handleCopy = async () => {
    if (!result) return

    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      setCopied(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleUploadComplete = (result: any) => {
    if (result.success) {
      setResult(result.data);
      toast.success('File converted successfully!');
    } else {
      setError(result.error);
      toast.error(result.error || 'File conversion failed');
    }
  };

  const handleUploadError = (error: string) => {
    setError(error);
    toast.error(error);
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Conversions"
          value={metrics.totalConversions}
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard
          title="Success Rate"
          value={`${(metrics.overallSuccessRate || 0).toFixed(1)}%`}
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <MetricCard
          title="Avg Processing"
          value={`${(metrics.averageProcessingTime || 0).toFixed(0)}ms`}
          icon={<Clock className="w-4 h-4" />}
        />
        <MetricCard
          title="Data Quality"
          value={`${(metrics.averageDataQuality || 0).toFixed(1)}%`}
          icon={<Zap className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div>
          <MetricCard
            title="Processing Speed"
            value={`${metrics.averageProcessingTime || 0}ms`}
            icon={<Clock className="w-4 h-4" />}
            description="Average conversion time"
            trend={-5}
          />
        </motion.div>
        <motion.div>
          <MetricCard
            title="Complexity Score"
            value={String((metrics.averageComplexityScore || 0).toFixed(2))}
            icon={<Activity className="w-4 h-4" />}
            description="Data structure complexity"
            trend={10}
          />
        </motion.div>
        <motion.div>
          <MetricCard
            title="Compression Ratio"
            value={`${(metrics.averageCompressionRatio || 0).toFixed(2)}x`}
            icon={<Minimize2 className="w-4 h-4" />}
            description="Size reduction achieved"
            trend={15}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Input Data
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="text-xs bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-600/40 hover:to-blue-600/40 backdrop-blur-sm transition-all duration-300"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Upload Any File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="*/*" // Accept all file types
                />
              </div>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your data here (text, HTML, or Markdown)"
              className="min-h-[200px] font-mono text-sm text-slate-800 bg-white dark:bg-gray-800 resize-none"
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Upload File
            </h3>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
            />
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-2 border-gray-100 dark:border-gray-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              JSON Schema Format
            </label>
            <Textarea
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="Enter JSON schema format"
              className="min-h-[200px] font-mono text-sm text-green-700 bg-white dark:bg-gray-800 resize-none"
            />
          </Card>

          <Button
            onClick={handleConvert}
            disabled={loading || !input.trim()}
            className={cn(
              "w-full h-12 transition-all duration-200 ease-in-out transform hover:scale-[1.02]",
              "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
              "text-white font-medium rounded-lg shadow-lg hover:shadow-xl",
              "relative overflow-hidden",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-400/20 before:via-blue-400/20 before:to-purple-400/20",
              "before:animate-shimmer before:bg-[length:200%_100%]",
              loading && "animate-pulse"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="relative z-10 animate-pulse bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  {loadingTexts[conversionStep]}
                </span>
              </>
            ) : (
              <>
                <FileJson className="w-4 h-4 mr-2" />
                <span className="relative z-10 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text">
                  Convert to JSON
                </span>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 animate-pulse blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20 animate-shimmer" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card className={cn(
            "p-6 min-h-[500px] backdrop-blur-sm border-2",
            "bg-white",
            "border-gray-100 dark:border-gray-800 shadow-xl"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Result
              </h3>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-[400px]"
                >
                  <div className="space-y-4 text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]" />
                    <p className="text-sm bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent font-medium animate-pulse">
                      {loadingTexts[conversionStep]}
                    </p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <pre className="overflow-auto rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 text-sm text-slate-800 dark:text-slate-200 font-mono max-h-[400px] shadow-inner">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-purple-500/50 to-blue-500/50 hover:from-purple-600/50 hover:to-blue-600/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500/50 to-teal-500/50 hover:from-emerald-600/50 hover:to-teal-600/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex justify-center"
                  >
                    <Button
                      onClick={handleCopy}
                      className={cn(
                        "px-6 py-2 rounded-full shadow-lg",
                        "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500",
                        "hover:from-violet-700 hover:via-fuchsia-600 hover:to-pink-600",
                        "transform transition-all duration-300 hover:scale-105 hover:shadow-xl",
                        "text-white font-medium",
                        "border border-white/20 backdrop-blur-sm"
                      )}
                    >
                      {copied ? (
                        <span className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Clipboard className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-[400px]"
                >
                  <p className="text-sm bg-gradient-to-r from-blue-600 via-pink-500 to-violet-600 bg-clip-text text-transparent font-medium">
                    Enter your data and click convert to see the result {"   "}😍🚀
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function detectInputType(input: string): string {
  try {
    JSON.parse(input);
    return 'json';
  } catch {
    if (input.startsWith('<?xml') || input.includes('</')) return 'xml';
    if (input.includes('---') || input.includes(': ')) return 'yaml';
    if (input.includes('=') && input.includes('[')) return 'toml';
    if (input.includes(',')) return 'csv';
    return 'text';
  }
}

function calculateComplexity(input: string): number {
  const depth = (input.match(/[{[]/g) || []).length;
  const nestingLevel = (input.match(/[{}[\]]/g) || []).length / 2;
  const properties = (input.match(/["'][^"']+["']\s*:/g) || []).length;
  const length = input.length;
  
  const score = (
    (depth * 15) + 
    (nestingLevel * 10) + 
    (properties * 5) + 
    (length / 200)
  ) / 4;
  
  return Number(Math.min(100, score).toFixed(2));
}

function calculateCompressionRatio(inputSize: number, outputSize: number): number {
  if (outputSize === 0) return 1;
  const ratio = inputSize / outputSize;
  return Number(Math.max(1, Math.min(ratio, 100)).toFixed(2));
}

export default JsonConverter;