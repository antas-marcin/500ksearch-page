import React, { useState } from 'react';
import { ImageSearchResult } from '../weaviateClient';

interface DebugPanelProps {
  images: ImageSearchResult[];
}

const DebugPanel: React.FC<DebugPanelProps> = ({ images }) => {
  const [showDebug, setShowDebug] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const renderImageData = (image: ImageSearchResult, index: number) => {
    const isOpen = selectedImage === index;
    
    return (
      <div key={image._additional?.id || index} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
        <div 
          style={{ cursor: 'pointer', fontWeight: 'bold' }} 
          onClick={() => setSelectedImage(isOpen ? null : index)}
        >
          Image #{index + 1} {image.prompt ? `- ${image.prompt.substring(0, 30)}...` : ''}
          {isOpen ? ' ▼' : ' ▶'}
        </div>
        
        {isOpen && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ marginBottom: '5px' }}><strong>Prompt:</strong> {image.prompt || 'N/A'}</div>
            <div style={{ marginBottom: '5px' }}><strong>ID:</strong> {image._additional?.id || image.id || 'N/A'}</div>
            <div style={{ marginBottom: '5px' }}><strong>Distance:</strong> {image._additional?.distance?.toFixed(4) || 'N/A'}</div>
            <div style={{ marginBottom: '5px' }}>
              <strong>Image data:</strong> 
              {image.image 
                ? `Base64 string (${image.image.length} chars)` 
                : 'No image data'
              }
            </div>
            {image.image && (
              <div style={{ marginTop: '10px' }}>
                <div><strong>First 100 chars:</strong></div>
                <div style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                  {image.image.substring(0, 100)}...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
      <button 
        onClick={toggleDebug}
        style={{ 
          padding: '8px 15px', 
          backgroundColor: '#555', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
      </button>
      
      {showDebug && (
        <div style={{ marginTop: '15px' }}>
          <h3>Debug Information</h3>
          <div><strong>Total Images:</strong> {images.length}</div>
          
          <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Image Data:</h4>
          <div>
            {images.map((image, index) => renderImageData(image, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;