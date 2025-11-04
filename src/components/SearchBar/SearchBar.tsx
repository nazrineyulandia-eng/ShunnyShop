// TODO: Create SearchBar component

import React from 'react';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search products..." className="search-input" />
      <button className="search-button">Search</button>
    </div>
  );
};
export default SearchBar;