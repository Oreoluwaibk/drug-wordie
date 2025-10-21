import React from "react";
import { Link } from "react-router-dom";
import "../styles.css"

const HomePage = () => {
  return (
    <div className="stat-total">
       <div className="stat-screen flex">
 <h1 className="header">Welcome to DRUG WORDIE</h1>
      <p className="description">
        Guess the hidden word in six tries. Each guess must be a valid 5-letter word. 
        Tile colors will show how close your guess was!
      </p>

      <div className="btn-div">
        <Link to="/play" className="btn-primary">Play Game</Link>
        <Link to="/help" className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg">
          How to Play
        </Link>
      </div>

      <p className="stats">
        <Link to="/stats" className="text-blue-600 underline">View your Stats</Link>
      </p>
       </div>
     
    </div>
  );
};

export default HomePage;
