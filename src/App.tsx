import React, { useState } from "react";
import classnames from "classnames";

import { boardAtom } from "./atoms/boardState";
import { selectedMarkerAtom } from "./atoms/selectedMarker";
import "./App.scss";
import { useAtom } from "jotai";

const BLACK = 2;
const WHITE = 1;
const EMPTY = 0;

const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 11;

// highlight a piece by clicking on it.
// Any piece that has an open space next to it should be highlightable

// has valid move: get neighbors.  One neighbor or more is empty.

function App() {
  const [boardState, updateBoardState] = useAtom(boardAtom);
  const [selectedMarker, updateSelectedMarker] = useAtom(selectedMarkerAtom);

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
        row.push(
          <div onClick={() => handleMove(i, j)} className="cell" id={`${i}-${j}-cell`} key={`${i}-${j}`}>
            <div
              id={`${i}-${j}-marker`}
              className={markerClasses}
              onClick={() => handleClickMarker(i, j)}
            ></div>
          </div>
        );
      }
      boardContents.push(row);
    }
    return <div className="board">{boardContents}</div>;
  };

  const hasEmptyNeighbors = (row: number, column: number): boolean => {
    const neighbors = {
      north: boardState[row - 1]?.[column],
      south: boardState[row + 1]?.[column],
      east: boardState[row][column + 1],
      west: boardState[row][column - 1],
    };
    for (let prop in neighbors) {
      if (neighbors[prop as "north" | "south" | "east" | "west"] === EMPTY) {
        return true;
      }
    }
    console.log(false);
    return false;
  };

  const handleClickMarker = (row: number, col: number) => {
    if(hasEmptyNeighbors(row, col)){
      selectMarker(row, col)
    }
  }

  const selectMarker = (row: number, col: number) => {
    removeCurrentHighlight();
    highlightMarker(row, col);
    updateSelectedMarker(`${row}-${col}`);
  };

  const highlightMarker = (row: number, column: number) => {
    document
      .getElementById(`${row}-${column}-marker`)
      ?.classList?.add("highlight");
  };

  const handleMove = (row: number, column: number) => {
    if(boardState[row][column] !== EMPTY || !selectedMarker){
      return;
    } else {
      const currentCoordinates = selectedMarker.split('-')
      console.log(currentCoordinates)

      const currentEl = document.getElementById(`${selectedMarker}-marker`);
      currentEl?.classList.remove("isWhite");
      currentEl?.classList.remove("isBlack");
      document.getElementById(`${row}-${column}-marker`)?.classList.add("isBlack")
    }
  };

  const removeCurrentHighlight = () => {
    console.log(selectedMarker);
    const el = document.getElementById(`${selectedMarker}-marker`);
    console.log(el);
    if (el) {
      el?.classList.remove("highlight");
    }
  };

  return (
    <div className="App">
      <h1 className="title">Hnefatafl</h1>
      {makeBoard(BOARD_WIDTH, BOARD_HEIGHT)}
    </div>
  );
}

export default App;
