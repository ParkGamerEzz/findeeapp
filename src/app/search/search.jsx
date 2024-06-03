import React from 'react';

const SearchBarPopup = ({ isVisible, onClose }) => {
  return (
    <div className={`search-popup ${isVisible ? 'show' : ''}`}>
      <div className="search-popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <input type="text" placeholder="search bar" />
        <input type="text" placeholder="#tag" />
        <input type="text" placeholder="#tag" />
        <button className="search-button">Search</button>
      </div>
    </div>
  );
};

export default SearchBarPopup;
