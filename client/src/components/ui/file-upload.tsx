/**
 * File Upload Component
 * 
 * A comprehensive file upload component with drag-and-drop support,
 * file validation, and professional styling. Designed for uploading
 * activity certificates and supporting documents.
 * 
 * Features:
 * - Drag and drop file upload interface
 * - File type and size validation
 * - Multiple file support with limits
 * - Visual file previews with metadata
 * - Error handling and user feedback
 * - Professional file type icons
 * - Progress UI components (for future upload progress implementation)
 * 
 * Validation Features:
 * - File type restrictions (PDF, JPG, PNG)
 * - File size limits (configurable)
 * - Client-side validation for user experience
 * - File metadata handling
 * 
 * Supported File Types:
 * - PDF: For certificates and official documents
 * - JPG/PNG: For images and scanned documents
 */

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Upload, FileText, Image, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * File Upload Component Props
 * 
 * Configuration interface for the file upload component.
 * Allows customization of upload restrictions and behavior.
 */
interface FileUploadProps {
  files: File[];                    // Current list of uploaded files
  onFilesChange: (files: File[]) => void; // Callback when file list changes
  maxFiles?: number;                // Maximum number of files allowed
  maxFileSize?: number;             // Maximum file size in bytes
  acceptedFileTypes?: string[];     // Allowed file extensions
  className?: string;               // Additional CSS classes
}

/**
 * Extended File Interface
 * 
 * Extends the standard File interface to include upload progress
 * and error tracking for enhanced user feedback.
 */
interface FileWithProgress extends File {
  id: string;           // Unique identifier for the file
  progress?: number;    // Upload progress percentage (0-100)
  error?: string;       // Error message if upload fails
}

export default function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * File Validation Function
   * 
   * Validates uploaded files against size and type restrictions.
   * Provides user-friendly error messages for validation failures.
   * 
   * @param file - File to validate
   * @returns Error message if validation fails, null if valid
   */
  const validateFile = (file: File): string | null => {
    // Check file size against maximum allowed
    if (file.size > maxFileSize) {
      return `File size must be less than ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB`;
    }

    // Check file type against accepted extensions
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension || '')) {
      return `File type not supported. Accepted types: ${acceptedFileTypes.join(', ')}`;
    }

    return null; // File is valid
  };

  const processFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    let errorMessage = "";

    // Check total file count
    if (files.length + fileArray.length > maxFiles) {
      errorMessage = `Maximum ${maxFiles} files allowed`;
      setError(errorMessage);
      return;
    }

    // Validate each file
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        errorMessage = validationError;
        break;
      }

      // Check for duplicates
      if (files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
        errorMessage = `File "${file.name}" already exists`;
        break;
      }

      validFiles.push(file);
    }

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError("");
    onFilesChange([...files, ...validFiles]);
  }, [files, maxFiles, maxFileSize, acceptedFileTypes, onFilesChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    setError("");
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)} data-testid="file-upload-container">
      {/* Upload Area */}
      <div
        className={cn(
          "upload-area",
          isDragging && "drag-over"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        data-testid="upload-drop-zone"
      >
        <Upload className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
        <p className="text-sm font-medium text-foreground mb-2">
          Drag and drop files or click to select
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: {acceptedFileTypes.join(', ').toUpperCase()} (up to {(maxFileSize / (1024 * 1024)).toFixed(0)}MB per file)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Maximum {maxFiles} files allowed
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileSelect}
          data-testid="file-input"
        />
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" data-testid="file-upload-error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File Preview List */}
      {files.length > 0 && (
        <div className="space-y-2" data-testid="file-preview-list">
          <h4 className="text-sm font-medium text-foreground">Uploaded Files ({files.length})</h4>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border"
              data-testid={`file-preview-${index}`}
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.name)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-muted-foreground hover:text-destructive"
                data-testid={`remove-file-${index}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress Info */}
      {files.length > 0 && (
        <div className="text-xs text-muted-foreground" data-testid="upload-info">
          {files.length} of {maxFiles} files selected
        </div>
      )}
    </div>
  );
}
