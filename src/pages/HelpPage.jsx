import React from "react";
import { Link } from "react-router-dom";
import "../styles.css"

const HelpPage = () => (
  <div className="stat-total">
    <div className="stat-screen">
<h2 className="text-3xl font-bold mb-4">How to Play</h2>
    <div className="bg-gray-100 p-6 rounded-xl max-w-lg shadow-md text-left">
      <p className="mb-4">
        Guess the hidden word in six tries. Each guess must be a valid 5-letter word.
        Press <strong>Enter</strong> to submit.
      </p>
      <p className="mb-2 font-semibold">After each guess:</p>
      <ul className="list-disc">
        <li><span className="text-green-600 font-bold">Green</span> = Correct letter, correct spot.</li>
        <li><span className="text-yellow-500 font-bold">Yellow</span> = Correct letter, wrong spot.</li>
        <li><span className="text-gray-500 font-bold">Gray</span> = Letter not in the word.</li>
      </ul>
      <p>Try to guess the word in as few tries as possible. Good luck!</p>
    </div>

    <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
    
  </div>
);

export default HelpPage;
