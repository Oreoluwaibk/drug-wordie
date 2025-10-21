import React from "react";

const MAX_GUESSES = 6;

export default function GuessGrid({ guesses, currentGuess, targetWord }) {
  const WORD_LENGTH = targetWord.length || 10;

  const getCellColor = (letter, index, row) => {
    if (!row) return "";
    const upper = letter.toUpperCase();
    if (upper === targetWord[index]) return "green";
    if (targetWord.includes(upper)) return "yellow";
    return "gray";
  };

  return (
    <div className="grid">
      {Array.from({ length: MAX_GUESSES }).map((_, r) => {
        const guess = guesses[r] || "";
        const isCurrent = r === guesses.length ? currentGuess : "";
        const row = guess || isCurrent;
        return (
          <div className="row" key={r}>
            {Array.from({ length: WORD_LENGTH }).map((_, c) => {
              const letter = row[c] || "";
              const color = guess ? getCellColor(letter, c, guess) : "";
              return (
                <div key={c} className={`cell ${color}`}>
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
