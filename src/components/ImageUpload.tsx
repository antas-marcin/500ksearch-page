import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (base64Image: string) => void;
  isUploading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, isUploading }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        const base64String = event.target.result.split(',')[1]; // Remove the data:image/jpeg;base64, part
        setSelectedImage(event.target.result);
        // We keep the full data URL for preview, but send just the base64 part for the API
        onImageUpload(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <div 
        className={`image-upload-area ${dragActive ? 'drag-active' : ''} ${selectedImage ? 'has-image' : ''}`}
        onClick={!selectedImage ? handleClick : undefined}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*" 
          style={{ display: 'none' }}
        />
        
        {selectedImage ? (
          <div className="image-preview">
            <img src={selectedImage} alt="Preview" />
            {!isUploading && (
              <button 
                className="cancel-button" 
                onClick={(e) => { e.stopPropagation(); handleCancel(); }}
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📁</div>
            <p>Drag & drop an image here, or click to select</p>
            <p className="upload-subtitle">Search for similar images using visual similarity</p>
          </div>
        )}
        
        {isUploading && (
          <div className="upload-loading">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;