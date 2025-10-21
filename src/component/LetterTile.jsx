import React from "react";

const LetterTile = ({ letter, evaluation }) => {
  const classes = `tile ${evaluation ? evaluation : ""}`;
  return <div className={classes}>{letter}</div>;
};

export default LetterTile;
