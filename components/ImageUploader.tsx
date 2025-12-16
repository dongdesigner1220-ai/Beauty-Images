import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelect: (file: File) => void;
  onRemove: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageSelect, onRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  if (currentImage) {
    return (
      <div className="relative w-full h-96 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 group">
        <img src={currentImage} alt="Preview" className="w-full h-full object-contain" />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={triggerUpload}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-gray-700 transition-all"
            title="Replace Image"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={onRemove}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-red-500 transition-all"
            title="Remove Image"
          >
            <X size={20} />
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerUpload}
      className={`
        w-full h-96 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'}
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="p-4 bg-blue-100 rounded-full mb-4">
        <Upload className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & drop your image here</h3>
      <p className="text-gray-500">JPG, PNG, WEBP – Max 10MB</p>
    </div>
  );
};