import React, { useState } from 'react';
import { ImageSearchResult } from '../weaviateClient';

interface ImageCardProps {
  image: ImageSearchResult;
  onSelect: (image: ImageSearchResult) => void;
  onFindSimilar: (objectId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onSelect, onFindSimilar }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image load error:", e);
    setImageError(true);
  };
  
  // Check if image data exists and is valid base64
  const hasValidImage = () => {
    return image.image && typeof image.image === 'string' && image.image.length > 0;
  };

  // Fallback image if the main image fails to load
  const fallbackImageUrl = 'https://via.placeholder.com/300x200?text=Image+Not+Available';

  // Format metadata for display
  const formatMetadata = () => {
    const metadata = [];
    
    if (image.prompt) metadata.push(`Prompt: ${image.prompt}`);
    if (image.title) metadata.push(`Title: ${image.title}`);
    if (image.description) metadata.push(`Description: ${image.description}`);
    
    if (image.tags && image.tags.length > 0) {
      metadata.push(`Tags: ${image.tags.join(', ')}`);
    }
    
    if (image.metadata) {
      if (image.metadata.photographer) metadata.push(`Photographer: ${image.metadata.photographer}`);
      if (image.metadata.captureDate) metadata.push(`Date: ${image.metadata.captureDate}`);
      if (image.metadata.location) metadata.push(`Location: ${image.metadata.location}`);
    }
    
    if (image._additional?.distance !== undefined) {
      metadata.push(`Relevance: ${(1 - image._additional.distance).toFixed(2)}`);
    }
    
    return metadata.join(' | ');
  };

  const getObjectId = (): string => {
    return image._additional?.id || image.id;
  };

  const handleFindSimilarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    const objectId = getObjectId();
    if (objectId) {
      onFindSimilar(objectId);
    }
  };

  return (
    <div className="image-card" onClick={() => onSelect(image)}>
      <div className="image-container">
        {hasValidImage() && !imageError ? (
          <img
            src={`data:image/jpeg;base64,${image.image}`}
            alt={image.prompt || 'Image'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        ) : (
          <img
            src={fallbackImageUrl}
            alt="Failed to load image"
          />
        )}
        {!imageLoaded && !imageError && (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading...
          </div>
        )}
        <div className="image-tooltip">
          {formatMetadata()}
        </div>
        
        <button 
          className="find-similar-button"
          onClick={handleFindSimilarClick}
          title="Find visually similar images"
        >
          Find Similar
        </button>
      </div>
    </div>
  );
};

export default ImageCard;