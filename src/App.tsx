import React, { useState, useEffect } from 'react';
import SearchTabs from './components/SearchTabs';
import ImageGrid from './components/ImageGrid';
import ImageDetails from './components/ImageDetails';
import AboutModal from './components/AboutModal';
import DebugPanel from './components/DebugPanel';
import { 
  initWeaviateClient, 
  searchImages,
  searchImagesByImage,
  searchImagesByObjectId,
  getAllImages, 
  ImageSearchResult 
} from './weaviateClient';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false); // Set to false to hide debug panel
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageSearchResult | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [currentSearchType, setCurrentSearchType] = useState<string>('text');
  const [currentSearchParams, setCurrentSearchParams] = useState<any>(null);
  // Initialize dark mode from localStorage or system preference
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  const initialDarkMode = storedTheme ? storedTheme === 'dark' : prefersDarkMode;
  
  const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);
  const limit = 12; // Number of results per page
  // Hardcoded to DiffusionPrompt
  const className = 'DiffusionPrompt';
  
  // Effect to set theme on document and store in localStorage
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Force a repaint to ensure the theme is applied
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    document.body.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
  }, [darkMode]);
  
  // Connect automatically on component mount using environment variables
  useEffect(() => {
    // Connect to Weaviate using environment variables
    connectToWeaviate();
  }, []);

  // Function to connect to Weaviate endpoint using environment variables
  const connectToWeaviate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize the Weaviate client with credentials from environment variables
      const host = process.env.REACT_APP_WEAVIATE_HOST || 'localhost:8080';
      const apiKey = process.env.REACT_APP_WEAVIATE_API_KEY;
      const scheme = process.env.REACT_APP_WEAVIATE_SCHEME || 'https';
      
      initWeaviateClient(scheme, host, apiKey);
      
      // Try to fetch some images to verify the connection and set connected state
      await loadInitialImages();
      setConnected(true);
    } catch (err: any) {
      setError(`Failed to connect to Weaviate: ${err.message}`);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Function to load initial images
  const loadInitialImages = async () => {
    try {
      setLoading(true);
      setError(null);
      // Reset all search and pagination state
      setCurrentPage(0);
      setCurrentQuery('');
      setCurrentSearchType('default');
      setCurrentSearchParams(null);
      setSelectedImage(null);
      
      // Clear existing images first
      setImages([]);
      
      const fetchedImages = await getAllImages(className, limit, 0);
      setImages(fetchedImages);
      
      if (fetchedImages.length === 0) {
        // If no images were found, the class might be different
        setError(`No images found in class '${className}'. The class name might be different.`);
      }
    } catch (err: any) {
      setError(`Error loading images: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle text search
  const handleTextSearch = async (query: string) => {
    try {
      setSearching(true);
      setError(null);
      setSelectedImage(null); // Clear selected image when searching
      setCurrentPage(0);
      setCurrentQuery(query);
      setCurrentSearchType('text');
      setCurrentSearchParams(null);
      
      // Clear existing images first
      setImages([]);
      
      const results = await searchImages(query, className, limit, 0);
      setImages(results);
    } catch (err: any) {
      setError(`Text search error: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };
  
  // Function to handle image search
  const handleImageSearch = async (base64Image: string) => {
    try {
      setSearching(true);
      setError(null);
      setSelectedImage(null); // Clear selected image when searching
      setCurrentPage(0);
      setCurrentQuery('');
      setCurrentSearchType('image');
      setCurrentSearchParams(base64Image);
      
      // Clear existing images first
      setImages([]);
      
      const results = await searchImagesByImage(base64Image, className, limit, 0);
      setImages(results);
    } catch (err: any) {
      setError(`Image search error: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };
  
  // Function to find similar images based on object ID
  const handleFindSimilar = async (objectId: string) => {
    try {
      setSearching(true);
      setError(null);
      setSelectedImage(null); // Clear selected image when searching
      setCurrentPage(0);
      setCurrentQuery('');
      setCurrentSearchType('similar');
      setCurrentSearchParams(objectId);
      
      // Clear existing images first
      setImages([]);
      
      const results = await searchImagesByObjectId(objectId, className, limit, 0);
      setImages(results);
    } catch (err: any) {
      setError(`Find similar error: ${err.message}`);
    } finally {
      setSearching(false);
    }
  };
  
  // Function to load more results
  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      setError(null);
      
      const nextPage = currentPage + 1;
      const offset = nextPage * limit;
      let newResults: ImageSearchResult[] = [];
      
      // Determine which search function to call based on current search type
      if (currentSearchType === 'text' && currentQuery) {
        newResults = await searchImages(currentQuery, className, limit, offset);
      } else if (currentSearchType === 'image' && currentSearchParams) {
        newResults = await searchImagesByImage(currentSearchParams, className, limit, offset);
      } else if (currentSearchType === 'similar' && currentSearchParams) {
        newResults = await searchImagesByObjectId(currentSearchParams, className, limit, offset);
      } else {
        newResults = await getAllImages(className, limit, offset);
      }
      
      if (newResults.length > 0) {
        setImages([...images, ...newResults]);
        setCurrentPage(nextPage);
      } else {
        // No more results
        setError("No more results available");
      }
    } catch (err: any) {
      setError(`Error loading more results: ${err.message}`);
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Function to handle image selection
  const handleImageSelect = (image: ImageSearchResult) => {
    setSelectedImage(image);
  };
  
  // Function to close image details
  const handleCloseDetails = () => {
    setSelectedImage(null);
  };
  
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="app-container">
      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', zIndex: 100 }}>
        <div className="theme-switch-wrapper">
          <label className="theme-switch" title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={toggleDarkMode} 
              aria-label="Dark mode toggle" 
            />
            <span className="slider round">
              <div className="slider-icons">
                <span className="light-icon">☀️</span>
                <span className="dark-icon">🌙</span>
              </div>
            </span>
          </label>
        </div>
        <button 
          type="button"
          className="about-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAbout(true);
          }}
        >
          About
        </button>
      </div>
      
      <h1 
        style={{ 
          marginBottom: '20px', 
          textAlign: 'center',
          cursor: 'pointer' 
        }}
        onClick={loadInitialImages}
        title="Reset to initial view"
      >
        <strong style={{ color: '#8B0000' }}>500k</strong>
        <span style={{ color: darkMode ? '#FFFFFF' : '#000000' }}>search</span>
      </h1>
      
      {connected && (
        <>
          <SearchTabs 
            onTextSearch={handleTextSearch} 
            onImageSearch={handleImageSearch}
            isSearching={searching} 
          />
          <ImageGrid 
            images={images} 
            loading={loading || searching} 
            error={error} 
            onImageSelect={handleImageSelect}
            onFindSimilar={handleFindSimilar}
          />
          
          {/* Show More button */}
          {!loading && !searching && images.length > 0 && (
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="search-button"
                style={{ 
                  width: 'auto',
                  display: 'inline-block',
                  backgroundColor: loadingMore ? '#ccc' : '#4285f4' 
                }}
              >
                {loadingMore ? 'Loading...' : 'Show More Results'}
              </button>
            </div>
          )}
          
          {/* Debug panel is hidden by default */}
          {showDebug && <DebugPanel images={images} />}
          
          {/* Image details overlay */}
          {selectedImage && (
            <ImageDetails image={selectedImage} onClose={handleCloseDetails} />
          )}
        </>
      )}
      
      {/* About modal */}
      {showAbout && <AboutModal isOpen={true} onClose={() => setShowAbout(false)} />}
      
      <div className="footer">
        Powered by <a href="https://weaviate.io/" target="_blank" rel="noopener noreferrer">Weaviate</a>
      </div>
    </div>
  );
};

export default App;