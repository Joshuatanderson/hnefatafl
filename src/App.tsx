import React, { useState } from "react";
import classnames from "classnames";

import { boardAtom } from "./atoms/boardState";
import "./App.scss";
import { useAtom } from "jotai";

const BLACK = 2;
const WHITE = 1;
const EMPTY = 0;

const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

function App() {
  const [boardState, updateBoardState] = useAtom(boardAtom);
  
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
