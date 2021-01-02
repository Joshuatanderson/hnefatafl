import React, { useState } from "react";
import classnames from "classnames";

import "./App.scss";

const BLACK = 2;
const WHITE = 1;
const EMPTY = 0;

const INIT_BOARD_STATE = [
  [0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
  [2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2],
  [2, 2, 0, 1, 1, 1, 1, 1, 0, 2, 2],
  [2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2],
  [2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
];

const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

function App() {
  const boardState = INIT_BOARD_STATE;
  const makeBoard = (BOARD_WIDTH: number, BOARD_HEIGHT: number) => {
    const boardContents: JSX.Element[][] = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const row: JSX.Element[] = [];
      for (let j = 0; j < BOARD_WIDTH; j++) {
        const markerClasses = classnames({
          marker: true,
          isWhite: boardState[i][j] === WHITE,
          isBlack: boardState[i][j] === BLACK,
        });
        console.log(boardState[i][j] === BLACK);
        row.push(
          <div className="cell" id="i - j" key={j}>
            <div className={markerClasses}></div>
          </div>
        );
      }
      boardContents.push(row);
    }
    return <div className="board">{boardContents}</div>;
  };

  return (
    <div className="App">
      <h1 className="title">Hnefatafl</h1>
      {makeBoard(BOARD_WIDTH, BOARD_HEIGHT)}
    </div>
  );
}

export default App;
