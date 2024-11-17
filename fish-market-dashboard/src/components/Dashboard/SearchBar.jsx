import { useState } from 'react';
import './SearchBar.css'; // Import the styles for this component

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter Order Number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button
        onClick={handleSearch}
        className="search-button"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
