import React from "react";

export default function Keyboard({ onKey, onEnter, onBack }) {
  const rows = [
    "QWERTYUIOP".split(""),
    "ASDFGHJKL".split(""),
    ["ENTER", "ZXCVBNM", "←"],
  ];

  const handleClick = (key) => {
    if (key === "ENTER") onEnter();
    else if (key === "←") onBack();
    else onKey(key);
  };

  return (
    <div className="keyboard">
      {rows.map((row, i) => (
        <div className="keyboard-row" key={i}>
          {row.map((key) => (
            <button
              key={key}
              className="key"
              onClick={() => handleClick(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
