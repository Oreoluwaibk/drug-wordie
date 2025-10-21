import React, { useEffect, useState } from "react";
import { loadStats } from "../utils/statsService";
import "../styles.css"
// import { loadStats } from "../services/statsService";

const StatsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  if (!stats) return <div className="text-center mt-10">Loading stats...</div>;

  const winRate =
    stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;

  return (
    <div className="stat-total">
       <div className="stat-screen">
      <h2 className="text-3xl font-bold mb-6">Your Game Statistics</h2>
      <div className="bg-gray-100 rounded-xl shadow-md p-6 w-full max-w-sm text-center">
        <p className="text-lg">Games Played: <strong>{stats.played}</strong></p>
        <p className="text-lg">Wins: <strong>{stats.wins}</strong></p>
        <p className="text-lg">Win Rate: <strong>{winRate}%</strong></p>
      </div>

      {stats.distribution && (
        <div className="mt-8 w-full max-w-sm">
          <h3 className="font-semibold text-xl mb-2 text-center">Guess Distribution</h3>
          <ul>
            {Object.entries(stats.distribution).map(([guessCount, count]) => (
              <li key={guessCount} className="flex justify-between border-b py-1">
                <span>{guessCount} guesses</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
   
  );
};

export default StatsPage;
