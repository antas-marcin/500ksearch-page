import React from 'react';
import { ImageSearchResult } from '../weaviateClient';

interface ImageDetailsProps {
  image: ImageSearchResult;
  onClose: () => void;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({ image, onClose }) => {
  // Ensure we have valid data to display
  const hasValidImage = image?.image && typeof image.image === 'string';
  
  return (
    <div className="image-details-overlay">
      <div className="image-details-content">
        <div className="image-details-header">
          <h2>Image Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="image-details-body">
          <div className="image-details-main">
            {hasValidImage ? (
              <img 
                src={`data:image/jpeg;base64,${image.image}`} 
                alt={image.prompt || 'Image'}
                className="details-image"
              />
            ) : (
              <div className="image-placeholder">Image not available</div>
            )}
          </div>
          
          <div className="image-details-info">
            <div className="detail-group">
              <h3>Prompt</h3>
              <p>{image.prompt || 'Not available'}</p>
            </div>
            
            <div className="detail-group">
              <h3>Dimensions</h3>
              <p>
                Width: {image.width || 'Not available'} 
                {image.height ? ` × Height: ${image.height}` : ''}
              </p>
            </div>
            
            <div className="detail-group">
              <h3>Source</h3>
              <p>{image.sourceSite || 'Not available'}</p>
            </div>
            
            {image.url && (
              <div className="detail-group">
                <h3>URL</h3>
                <a 
                  href={image.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  {image.url}
                </a>
              </div>
            )}
            
            {image._additional?.distance !== undefined && (
              <div className="detail-group">
                <h3>Relevance Score</h3>
                <p>{(1 - image._additional.distance).toFixed(4)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetails;