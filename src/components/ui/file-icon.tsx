import { FileType, FileSpreadsheet, FileJson } from 'lucide-react';

interface FileIconProps {
  filename: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ filename, className }) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <FileType className={className || "w-6 h-6 text-red-500"} />;
    case 'xlsx':
    case 'xls':
    case 'xlsm':
    case 'xlsb':
      return <FileSpreadsheet className={className || "w-6 h-6 text-green-500"} />;
    case 'csv':
      return <FileJson className={className || "w-6 h-6 text-blue-500"} />;
    default:
      return <FileType className={className || "w-6 h-6 text-gray-500"} />;
  }
}; 