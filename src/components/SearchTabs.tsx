import React from 'react';
import SearchBar from './SearchBar';
import ImageUpload from './ImageUpload';

export type SearchMode = 'text' | 'image';

interface SearchTabsProps {
  onTextSearch: (query: string) => void;
  onImageSearch: (base64Image: string) => void;
  isSearching: boolean;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ 
  onTextSearch, 
  onImageSearch, 
  isSearching 
}) => {
  const [activeTab, setActiveTab] = React.useState<SearchMode>('text');

  const handleTabChange = (tab: SearchMode) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="search-tabs">
        <div 
          className={`search-tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => handleTabChange('text')}
        >
          Text Search
        </div>
        <div 
          className={`search-tab ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => handleTabChange('image')}
        >
          Image Search
        </div>
      </div>
      
      <div className="search-content">
        {activeTab === 'text' ? (
          <SearchBar onSearch={onTextSearch} isSearching={isSearching} />
        ) : (
          <ImageUpload onImageUpload={onImageSearch} isUploading={isSearching} />
        )}
      </div>
    </div>
  );
};

export default SearchTabs;