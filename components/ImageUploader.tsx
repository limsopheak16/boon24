import React, { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  label: string;
  onFileSelect: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onFileSelect }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    } else {
      setImagePreview(null);
      onFileSelect(null);
    }
  }, [onFileSelect]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files ? e.target.files[0] : null);
  };
  
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    handleDrag(e);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    handleDrag(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e);
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="space-y-3">
      <div 
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-4 w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-brand-accent bg-brand-surface' : 'border-brand-border bg-brand-bg hover:border-brand-text-secondary'}`}
        onClick={onButtonClick}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="object-contain h-full w-full rounded-md" />
        ) : (
          <div className="text-center text-brand-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">Drag, drop, paste, or click</p>
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
      </div>
      <button 
        type="button" 
        onClick={onButtonClick}
        className="w-full bg-brand-panel hover:bg-brand-border text-brand-text-primary font-semibold py-2 px-4 rounded-md transition-colors"
      >
        {label}
      </button>
    </div>
  );
};
