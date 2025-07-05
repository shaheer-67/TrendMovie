import React from "react";
import searchIcon from "../assets/search.png";


const Search = ({ searchTerm , setsearchTerm}) => {
  return (
    <div className="search">


      <div>

      <img src={searchIcon} alt="" />
      <input
        type="text"
        placeholder="Search any kind of movie here"
        value={searchTerm}
        onChange={(e)=> setsearchTerm(e.target.value)}
      />

  
     </div>

    </div>
  );
};

export default Search;
