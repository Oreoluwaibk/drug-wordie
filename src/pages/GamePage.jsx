"use client";
import React, { useEffect, useState, useCallback } from "react";
// import { wordList as ALL_WORDS } from "../data/wordList"; // export named or default depending on your file
// import { recordGame } from "../services/statsService";
import "../game.css";
import { recordGame } from "../utils/statsService";
import { wordList as ALL_WORDS } from "../utils/wordService";

/**
 * Config
 */
const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 10;
const WORDS_PER_DAY = 5;

export default function GamePage() {
  // list of 5 words for today
  const [dailyWords, setDailyWords] = useState([]); // array of {title, date, info}
  const [currentIndex, setCurrentIndex] = useState(0); // which of the 5 we're on
  const [target, setTarget] = useState(null); // current target title string (upper)
  // const [targetData, setTargetData] = useState(null); // full object for popup
  const [guesses, setGuesses] = useState([]); // array of guess strings (uppercase)
  const [currentGuess, setCurrentGuess] = useState(""); // partial guess (uppercase)
  const [evaluations, setEvaluations] = useState([]); // array of arrays of evaluations per guess
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null); // 'win' | 'lose' | 'done'
  const [allDone, setAllDone] = useState(false);

  // Build dailyWords: pick those with today's date OR fallback to first 5
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // ensure ALL_WORDS has uppercase titles
    const normalized = ALL_WORDS.map((w) => ({
      ...w,
      title: (w.title || "").toUpperCase(),
    }));
    const todays = normalized.filter((w) => w.date === today).slice(0, WORDS_PER_DAY);
    if (todays.length >= WORDS_PER_DAY) {
      setDailyWords(todays);
    } else {
      // fallback: take first WORDS_PER_DAY from normalized (or combine today's + more)
      const combined = [...todays];
      for (let i = 0; combined.length < WORDS_PER_DAY && i < normalized.length; i++) {
        if (!combined.some((x) => x.title === normalized[i].title)) combined.push(normalized[i]);
      }
      setDailyWords(combined.slice(0, WORDS_PER_DAY));
    }
  }, []);

  // when dailyWords or currentIndex changes, set the target for the round
  useEffect(() => {
    if (!dailyWords.length) return;
    const data = dailyWords[currentIndex];
    setTarget(data.title);
    // setTargetData(data);
    setGuesses([]);
    setCurrentGuess("");
    setEvaluations([]);
    setShowPopup(false);
    setPopupType(null);
  }, [dailyWords, currentIndex]);

  // evaluate a guess against current target, return array of 'correct'|'present'|'absent'
  const evaluateGuess = useCallback((guess, targetWord) => {
    const guessArr = guess.split("");
    const targetArr = targetWord.split("");
    const result = Array(WORD_LENGTH).fill("absent");
    const used = Array(WORD_LENGTH).fill(false);

    // 1) correct
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArr[i] === targetArr[i]) {
        result[i] = "correct";
        used[i] = true;
      }
    }

    // 2) present (respect counts)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === "correct") continue;
      const letter = guessArr[i];
      let foundIdx = -1;
      for (let j = 0; j < WORD_LENGTH; j++) {
        if (!used[j] && targetArr[j] === letter) {
          foundIdx = j;
          break;
        }
      }
      if (foundIdx !== -1) {
        result[i] = "present";
        used[foundIdx] = true;
      }
    }
    return result;
  }, []);

  // submit current guess
  const submitGuess = useCallback(() => {
    if (!target) return;
    if (currentGuess.length !== WORD_LENGTH) {
      // show a small inline message — you can replace with better UI
      alert(`Guess must be ${WORD_LENGTH} letters`);
      return;
    }

    const guess = currentGuess.toUpperCase();
    const evals = evaluateGuess(guess, target);
    const nextGuesses = [...guesses, guess];
    const nextEvals = [...evaluations, evals];
    setGuesses(nextGuesses);
    setEvaluations(nextEvals);
    setCurrentGuess("");

    // win
    if (guess === target) {
      recordGame(true, nextGuesses.length);
      setPopupType("win");
      setShowPopup(true);
      return;
    }

    // lose (max attempts reached)
    if (nextGuesses.length >= MAX_ATTEMPTS) {
      recordGame(false);
      setPopupType("lose");
      setShowPopup(true);
      return;
    }

    // otherwise continue (user can try again)
  }, [currentGuess, evaluateGuess, evaluations, guesses, target]);

  // handle physical keyboard + also allow lowercase input
  useEffect(() => {
    const onKeyDown = (e) => {
      if (showPopup || allDone) return; // ignore input while popup is visible or all done

      const k = e.key;
      if (k === "Enter") {
        submitGuess();
        return;
      }
      if (k === "Backspace") {
        setCurrentGuess((s) => s.slice(0, -1));
        return;
      }
      // only accept letters
      if (/^[a-zA-Z]$/.test(k)) {
        setCurrentGuess((s) => (s.length < WORD_LENGTH ? (s + k.toUpperCase()) : s));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [submitGuess, showPopup, allDone]);

  // on-screen keyboard handler (from your Keyboard component)
  const handleKey = (key) => {
    if (showPopup || allDone) return;

    if (key === "ENTER") {
      submitGuess();
      return;
    }
    if (key === "BACKSPACE" || key === "←") {
      setCurrentGuess((s) => s.slice(0, -1));
      return;
    }
    // letter
    if (/^[A-Z]$/.test(key)) {
      setCurrentGuess((s) => (s.length < WORD_LENGTH ? s + key : s));
    }
  };

  // proceed to next word (called from popup 'Next' button)
  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < dailyWords.length) {
      setCurrentIndex(nextIndex);
      // reset state is handled by useEffect on currentIndex
    } else {
      // finished all words
      setAllDone(true);
      setShowPopup(true);
      setPopupType("done");
    }
  };

  // restart current word (clear guesses)
  const handleRestartRound = () => {
    setGuesses([]);
    setEvaluations([]);
    setCurrentGuess("");
    setShowPopup(false);
    setPopupType(null);
  };

  // helper to render a cell's color given rowIndex and colIndex
  const cellClass = (rowIndex, colIndex) => {
    const rowGuess = guesses[rowIndex];
    const rowEval = evaluations[rowIndex];
    if (!rowGuess) {
      // if it's the row being filled now (currentGuess), show typed letters (no color)
      if (rowIndex === guesses.length) {
        return "";
      }
      return "";
    }
    // use eval
    const evalVal = rowEval?.[colIndex];
    if (!evalVal) return "";
    if (evalVal === "correct") return "cell-correct";
    if (evalVal === "present") return "cell-present";
    return "cell-absent";
  };

  // get display letter for a cell
  const cellLetter = (rowIndex, colIndex) => {
    // completed guess
    if (guesses[rowIndex]) return guesses[rowIndex][colIndex] || "";
    // current guess row
    if (rowIndex === guesses.length) return currentGuess[colIndex] || "";
    return "";
  };

  // if dailyWords empty, show loading placeholder
  if (!dailyWords.length) {
    return (
      <div className="game-container">
        <h1>Drug Wordle</h1>
        <p>Loading words...</p>
      </div>
    );
  }

  const currentDrug = dailyWords[currentIndex];

  return (
    <div className="game-container">
      <h1>Drug Wordle — 5 words today</h1>
      <p className="subtitle">Word {currentIndex + 1} of {dailyWords.length} — Guess the {WORD_LENGTH}-letter drug name</p>

      <div className="board">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, r) => (
          <div className="row" key={r}>
            {Array.from({ length: WORD_LENGTH }).map((_, c) => (
              <div key={c} className={`tile ${cellClass(r, c)}`}>
                {cellLetter(r, c)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* On-screen keyboard (simple) — you may replace with your own Keyboard component */}
      <div className="keyboard">
        {[
          "QWERTYUIOP",
          "ASDFGHJKL",
          "ENTERZXCVBNM←"
        ].map((row, idx) => (
          <div className="kbd-row" key={idx}>
            {row.split("").map((k) => {
              // const label = k === "←" ? "⌫" : k;
              // treat ENTER specially (render wider)
              // const className = k === "E" && row.startsWith("ENTER") ? "kbd-enter" : "";
              // For simplicity: pass "ENTER" as label when encountering 'E' at start of row 2 or handle full word
              // We'll handle the third row specially:
              if (idx === 2 && k === "E" && row.startsWith("ENTER")) {
                return (
                  <button key={"ENTER"} className="kbd-key kbd-enter" onClick={() => handleKey("ENTER")}>
                    ENTER
                  </button>
                );
              }
              if (idx === 2 && k === "←") {
                return (
                  <button key={"BACK"} className="kbd-key" onClick={() => handleKey("BACKSPACE")}>
                    ⌫
                  </button>
                );
              }
              if (idx === 2 && "ZXCVBNM".includes(k)) {
                return (
                  <button key={k} className="kbd-key" onClick={() => handleKey(k)}>
                    {k}
                  </button>
                );
              }
              // first two rows:
              if (idx < 2) {
                return (
                  <button key={k} className="kbd-key" onClick={() => handleKey(k)}>
                    {k}
                  </button>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>

      {/* Extra small input (hidden) to allow mobile input fallback */}
      <div className="input-row">
        <input
          className="hidden-input"
          value={currentGuess}
          maxLength={WORD_LENGTH}
          onChange={(e) => {
            const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, WORD_LENGTH);
            setCurrentGuess(val);
          }}
        />
        <button className="submit-btn" onClick={submitGuess}>Enter</button>
        <button className="restart-btn" onClick={handleRestartRound}>Restart Round</button>
      </div>

      {/* Popup */}
      {showPopup && popupType && (
        <div className="overlay">
          <div className="popup-card">
            {popupType === "win" && (
              <>
                <h2>🎉 Correct!</h2>
                <p><strong>{currentDrug.title}</strong></p>
                <p><strong>Date:</strong> {currentDrug.date}</p>
                {currentDrug.info && <p className="muted">{currentDrug.info}</p>}
                <div className="popup-actions">
                  <button className="btn" onClick={() => { setShowPopup(false); }}>Close</button>
                  <button className="btn primary" onClick={handleNext}>Next Word</button>
                </div>
              </>
            )}

            {popupType === "lose" && (
              <>
                <h2>😞 Round Over</h2>
                <p>The correct word was <strong>{currentDrug.title}</strong></p>
                <p className="muted">{currentDrug.info}</p>
                <div className="popup-actions">
                  <button className="btn" onClick={() => { setShowPopup(false); }}>Close</button>
                  <button className="btn primary" onClick={handleNext}>Next Word</button>
                </div>
              </>
            )}

            {popupType === "done" && (
              <>
                <h2>All done — great job!</h2>
                <p>You've completed all {dailyWords.length} words for today.</p>
                <div className="popup-actions">
                  <button className="btn primary" onClick={() => { setAllDone(false); setShowPopup(false); setCurrentIndex(0); }}>
                    Restart All
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
