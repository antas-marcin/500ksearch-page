import React, { useEffect } from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling the background when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle overlay click - only close if user clicks outside the modal content
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>About 500ksearch</h2>
          <button 
            className="modal-close-button" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <h3>Technology Stack</h3>
          <p>
            This application uses <a href="https://weaviate.io/" target="_blank" rel="noopener noreferrer">Weaviate</a>, 
            a powerful vector database that enables semantic search and similarity-based retrieval.
          </p>
          
          <h3>Dataset</h3>
          <p>
            The database contains over 500,000 indexed AI-generated images with their prompts.
            The dataset used for indexing is the <a href="https://www.kaggle.com/datasets/tanreinama/900k-diffusion-prompts-dataset/suggestions?status=pending&yourSuggestions=true" target="_blank" rel="noopener noreferrer">900k Diffusion Prompts Dataset</a> from Kaggle.
          </p>
          
          <h3>Infrastructure</h3>
          <p>
            The entire system runs on energy-efficient hardware:
          </p>
          <ul>
            <li>Database and web application: <strong>Raspberry Pi 5</strong></li>
            <li>Vector embeddings/vectorizers: <strong>NVIDIA Jetson Orin</strong></li>
          </ul>
          
          <h3>Search Features</h3>
          <p>
            The application leverages Weaviate's vector search capabilities to provide:
          </p>
          <ul>
            <li><strong>Text Search:</strong> Find images using natural language queries</li>
            <li><strong>Image Search:</strong> Upload an image to find visually similar ones</li>
            <li><strong>Find Similar:</strong> Discover visually similar images to any result</li>
          </ul>
          
          <div className="about-footer">
            <p>
              Built with React, TypeScript, and Weaviate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;