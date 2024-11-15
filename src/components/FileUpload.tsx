"use client"

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Upload, Sparkles } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (result: any) => void;
  onError: (error: string) => void;
}

export function FileUpload({ onUploadComplete, onError }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');

  const messages = [
    "AI is working its magic... ✨",
    "Analyzing your document with cutting-edge AI... 🤖",
    "Almost there! Processing your content... 🎯",
    "Final touches being applied... 🌟",
    "Just a moment while we perfect everything... 💫"
  ];

  useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setProcessingMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [uploading]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setProcessingMessage(messages[0]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      };

      const response = await new Promise((resolve, reject) => {
        xhr.open('POST', '/api/json');
        xhr.onload = () => resolve(JSON.parse(xhr.response));
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      onUploadComplete(response);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      setProcessingMessage('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUploadComplete, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 1024 * 1024 * 500, // 500MB to handle large PDFs
    accept: {
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.js', '.ts', '.jsx', '.tsx', '.css', '.html', '.json', '.csv', '.xml', '.md'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
      'text/csv': ['.csv'],
      'application/x-yaml': ['.yaml', '.yml'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden
          p-12 border-2 border-dashed rounded-2xl
          ${isDragActive 
            ? 'border-blue-500 bg-gradient-to-r from-purple-100 via-blue-50 to-white' 
            : 'border-gray-200 hover:border-blue-400 dark:border-gray-700'}
          transition-all duration-300 ease-in-out
          hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
          cursor-pointer
          group
        `}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          <motion.div 
            className="flex flex-col justify-center items-center space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {uploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-purple-500" />
                </motion.div>
                <div className="space-y-3 text-center">
                  <motion.p 
                    className="bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-medium text-lg text-transparent"
                    animate={{ opacity: [0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {processingMessage}
                  </motion.p>
                  <p className="text-gray-200  text-lg">
                    {progress}% Complete 
                  </p>
                </div>
                <div className="bg-gray-800 rounded-full w-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-full"
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-purple-500 via-pink-600 to-blue-500 p-4 rounded-full"
                >
                  <Upload className="w-10 h-10 text-blue-800" />
                </motion.div>
                <div className="space-y-2 text-center">
                  <p className="bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-transparent text-xl">
                    Drop your files here or click to browse {"    "}  
                  </p>
                  <p className="text-gray-100 text-sm">
                    Supports PDFs (up to 1000 pages), code files, documents, and more⚡️
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}