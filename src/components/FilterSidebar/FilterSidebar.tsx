// TODO: Create FilterSidebar component (category filter + sort)
import React from 'react';
import './FilterSidebar.css';   

export const FilterSidebar: React.FC = () => {
  return (
    <aside className="filter-sidebar">
      <h2>Filter Products</h2>
      {/* Category Filter */}
      <div className="filter-section">
        <h3>Categories</h3> 
        <ul>
          <li>
            <label>
              <input type="checkbox" value="electronics" />
              Electronics
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="clothing" />
              Clothing
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" value="home" />
              Home
            </label>
          </li>
        </ul>
      </div>  
        {/* Sort Options */}
        <div className="filter-section">
          <h3>Sort By</h3>
          <select>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
    </aside>
  );
};

export default FilterSidebar;