import React, { useState, useRef } from "react";
import { Upload, X, Trash2, AlertCircle } from "lucide-react";

interface ImageUploadResponse {
  success: boolean;
  data: {
    id: number;
    imageUrl: string;
    originalFilename: string;
    fileSize: number;
    contentType: string;
    createdAt: string;
    updatedAt: string;
  };
  statusCode: number;
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, placeholder = "Image URL", className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImageId, setUploadedImageId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size (100KB = 100 * 1024 bytes)
    const maxSize = 100 * 1024;
    if (file.size > maxSize) {
      return `File size must be less than 100KB. Current size: ${Math.round(file.size / 1024)}KB`;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only image files (JPEG, PNG, GIF, WebP) are allowed';
    }

    return null;
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'products');



      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/image-uploads`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result: ImageUploadResponse = await response.json();
      
      if (result.success) {
        onChange(result.data.imageUrl);
        setUploadedImageId(result.data.id);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async () => {
    if (!uploadedImageId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/image-uploads/${uploadedImageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        onChange('');
        setUploadedImageId(null);
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      console.error('Delete error:', err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    uploadImage(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    uploadImage(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors flex items-center gap-1"
            title="Upload image"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </button>
          
          {value && uploadedImageId && (
            <button
              type="button"
              onClick={deleteImage}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-1"
              title="Delete uploaded image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center gap-1"
              title="Clear URL"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Drag and drop area with preview */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 transition-colors"
      >
        {value ? (
          <div className="space-y-2">
            <img
              src={value}
              alt="Preview"
              className="max-w-full max-h-32 mx-auto rounded-md object-contain"
              onError={(e) => {
                // If image fails to load, show fallback
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden">
              <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p>Invalid image URL</p>
            </div>
            <p className="text-xs text-gray-400">Click upload to replace image</p>
          </div>
        ) : (
          <div>
            <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p>Drag and drop an image here, or click the upload button</p>
            <p className="text-xs mt-1">Maximum file size: 100KB</p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
