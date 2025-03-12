import React, { useState } from 'react';

interface ConfigProps {
  onConnect: (host: string, apiKey: string) => void;
  isConnected: boolean;
}

const Config: React.FC<ConfigProps> = ({ onConnect, isConnected }) => {
  const [host, setHost] = useState<string>('localhost:8080');
  const [apiKey, setApiKey] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(!isConnected);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(host, apiKey);
    setShowConfig(false);
  };

  return (
    <div className="config-container" style={{ marginBottom: '20px' }}>
      {isConnected && !showConfig && (
        <button 
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#f0f0f0', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
          onClick={() => setShowConfig(true)}
        >
          Configure Weaviate Connection
        </button>
      )}
      
      {(!isConnected || showConfig) && (
        <form onSubmit={handleSubmit} style={{ 
          padding: '15px', 
          border: '1px solid #ddd', 
          borderRadius: '5px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ marginBottom: '10px' }}>Weaviate Connection Settings</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Weaviate Host:
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              placeholder="e.g., localhost:8080 or weaviate-instance.cloud.com"
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              API Key (optional):
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              placeholder="Leave empty if not required"
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#4285f4', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Connect
          </button>
          
          {isConnected && (
            <button 
              type="button" 
              onClick={() => setShowConfig(false)}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginLeft: '10px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Config;