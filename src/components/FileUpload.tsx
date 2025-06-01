import React, { useRef, useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  id: string;
  accept: string;
  maxSize: number; // in MB
  required?: boolean;
  description?: string;
  value: File | null;
  onChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  id,
  accept,
  maxSize,
  required,
  description,
  value,
  onChange
}) => {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      onChange(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(',');
    const fileType = `.${file.name.split('.').pop()}`;
    if (!acceptedTypes.includes(fileType)) {
      setError(`File type must be: ${accept}`);
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4",
          error ? "border-red-300 bg-red-50" : "border-diani-sand-200 hover:border-diani-teal-500",
          value ? "bg-diani-sand-50" : "bg-white"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required && !value}
        />
        
        <div className="text-center">
          {value ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-diani-teal-500" />
                <span className="text-sm font-medium text-diani-sand-700 truncate">
                  {value.name}
                </span>
                <span className="text-xs text-diani-sand-500">
                  ({(value.size / 1024 / 1024).toFixed(1)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 hover:bg-diani-sand-200 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-diani-sand-500" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-diani-sand-400" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-diani-sand-700">
                  Drop your file here, or <span className="text-diani-teal-500">browse</span>
                </p>
                {description && (
                  <p className="text-xs text-diani-sand-500">{description}</p>
                )}
                <p className="text-xs text-diani-sand-500">
                  Maximum file size: {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
};