import React from "react";
import { FaSearch } from "react-icons/fa";
import "./Search.css";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default Search;
