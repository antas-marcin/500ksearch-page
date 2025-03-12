import React from 'react';

interface AboutButtonProps {
  onClick: () => void;
}

const AboutButton: React.FC<AboutButtonProps> = ({ onClick }) => {
  // Use a simple div to avoid any browser default behaviors
  return (
    <div 
      className="about-button" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      About
    </div>
  );
};

export default AboutButton;