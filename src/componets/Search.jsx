import React from "react";

const Search = ({ searchTerm , setsearchTerm}) => {
  return (
    <div className="search">


      <div>

      <img src="./src/assets/search.png" alt="" />
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
