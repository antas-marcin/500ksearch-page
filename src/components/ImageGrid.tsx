import React from 'react';
import ImageCard from './ImageCard';
import { ImageSearchResult } from '../weaviateClient';

interface ImageGridProps {
  images: ImageSearchResult[];
  loading: boolean;
  error: string | null;
  onImageSelect: (image: ImageSearchResult) => void;
  onFindSimilar: (objectId: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, loading, error, onImageSelect, onFindSimilar }) => {
  if (loading) {
    return <div className="loading">Loading images...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Show empty state only if not loading
  if (images.length === 0 && !loading) {
    return <div className="loading">Loading more results...</div>;
  }

  return (
    <div className="images-grid">
      {images.map((image) => (
        <ImageCard 
          key={image._additional?.id || image.id} 
          image={image} 
          onSelect={onImageSelect}
          onFindSimilar={onFindSimilar}
        />
      ))}
    </div>
  );
};

export default ImageGrid;