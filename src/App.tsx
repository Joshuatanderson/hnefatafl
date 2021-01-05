import React, { useState } from "react";
import classnames from "classnames";
import { useAtom } from "jotai";
import produce from "immer";

import { Neighbors, SpaceValue } from "./types";
import { DARK, LIGHT, EMPTY, BOARD_HEIGHT, BOARD_WIDTH } from "./constants";
import { boardAtom } from "./atoms/boardState";
import { selectedMarkerAtom } from "./atoms/selectedMarker";
import "./App.scss";
import { activePlayerAtom } from "./atoms/activePlayer";
import { act } from "react-dom/test-utils";
import { CoordinatePair } from "./types/CoordinatePair";

// highlight a piece by clicking on it.
// Any piece that has an open space next to it should be highlightable

// has valid move: get neighbors.  One neighbor or more is empty.

function App() {
  const [boardState, updateBoardState] = useAtom(boardAtom);
  const [selectedMarker, updateSelectedMarker] = useAtom(selectedMarkerAtom);
  const [activePlayer, updateActivePlayer] = useAtom(activePlayerAtom);

  const makeBoard = (BOARD_WIDTH: number, BOARD_HEIGHT: number) => {
    const boardContents: JSX.Element[][] = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const row: JSX.Element[] = [];
      for (let j = 0; j < BOARD_WIDTH; j++) {
        const markerClasses = classnames({
          marker: true,
          isLight: boardState[i]?.[j] === LIGHT,
          isDark: boardState[i]?.[j] === DARK,
        });
        row.push(
          <div
            onClick={() => handleMove({row: i, col: j})}
            className="cell"
            id={`${i}-${j}-cell`}
            key={`${i}-${j}`}
          >
            <div
              id={`${i}-${j}-marker`}
              className={markerClasses}
              onClick={() => handleClickMarker({ row: i, col: j })}
            ></div>
          </div>
        );
      }
      boardContents.push(row);
    }
    return <div className="board">{boardContents}</div>;
  };

  const getNeighbors = ({ row, col }: CoordinatePair): Neighbors => {
    return {
      north: boardState[row - 1]?.[col],
      south: boardState[row + 1]?.[col],
      east: boardState[row]?.[col + 1],
      west: boardState[row]?.[col - 1],
    };
  };

  const hasEmptyNeighbors = (coordinates: CoordinatePair): boolean => {
    const neighbors = getNeighbors(coordinates);
    for (let prop in neighbors) {
      if (neighbors[prop as keyof Neighbors] === EMPTY) {
        return true;
      }
    }
    return false;
  };

  const handleClickMarker = ({ row, col }: CoordinatePair) => {
    if (
      hasEmptyNeighbors({ row, col }) &&
      boardState[row][col] === activePlayer
    ) {
      selectMarker({ row, col });
    }
  };

  const shouldBeCaptured = ({ row, col }: CoordinatePair): boolean => {
    const enemyColor = activePlayer === DARK ? LIGHT : DARK;
    const neighbors = {
      north: boardState[row - 1]?.[col],
      south: boardState[row + 1]?.[col],
      east: boardState[row][col + 1],
      west: boardState[row][col - 1],
    };

    if (Object.values(neighbors).includes(enemyColor)) {
      if (
        (neighbors.north === enemyColor && neighbors.south === enemyColor) ||
        (neighbors.east === enemyColor && neighbors.west === enemyColor) ||
        !Object.values(neighbors).includes(EMPTY)
      ) {
        return true;
      }
    }
    return false;
  };

  const captureMarker = ({ row, col }: CoordinatePair): void => {
    updateBoardState(
      produce(boardState, (draft) => {
        draft[row][col] = EMPTY;
      })
    );
  };

  const selectMarker = ({ row, col }: CoordinatePair) => {
    removeCurrentHighlight();
    highlightMarker({ row, col });
    updateSelectedMarker(`${row}-${col}`);
  };

  const highlightMarker = ({ row, col }: CoordinatePair) => {
    document
      .getElementById(`${row}-${col}-marker`)
      ?.classList?.add("highlight");
  };

  /**
   *
   * @param coordinatePair - coordinates to move to
   */

  const handleMove = ({ row, col }: CoordinatePair) => {
    if (!selectedMarker) {
      return false;
    }
    const [currentRow, currentColumn] = selectedMarker
      .split("-")
      .map((coordinate) => parseInt(coordinate));
    const moveIsLegal = isMoveLegal(row, col, currentRow, currentColumn);
    if (moveIsLegal) {
      const currentEl = document.getElementById(`${selectedMarker}-marker`);

      // clear current marker
      currentEl?.classList.remove("isLight");
      currentEl?.classList.remove("isDark");

      // add new marker
      document
        .getElementById(`${row}-${col}-marker`)
        ?.classList.add(activePlayer === DARK ? "isDark" : "isLight");

      updateBoardState(
        produce(boardState, (draft) => {
          draft[row][col] = activePlayer;
          draft[currentRow][currentColumn] = EMPTY;
        })
      );

      const neighbors = getNeighbors({row, col});

      // for(let neighbor in neighbors) {
      //   if(shouldBeCaptured())
        // capture
      // }

      updateActivePlayer(activePlayer === DARK ? LIGHT : DARK);
    }
  };

  const isMoveLegal = (
    targetRow: number,
    targetColumn: number,
    currentRow: number,
    currentColumn: number
  ) => {
    const moveIsObstructed = isMoveObstructed(
      targetRow,
      targetColumn,
      currentRow,
      currentColumn
    );
    const markerIsCorrectColor =
      boardState[currentRow][currentColumn] === activePlayer;
    if (!moveIsObstructed && markerIsCorrectColor) {
      return true;
    }
    return false;
  };

  const isMoveObstructed = (
    targetRow: number,
    targetColumn: number,
    currentRow: number,
    currentColumn: number
  ): boolean => {
    // is move orthogonal, to a non-occupied space, or to itself?
    if (
      boardState[targetRow][targetColumn] !== EMPTY ||
      (targetColumn === currentColumn && targetRow === currentRow) ||
      (targetColumn !== currentColumn && targetRow !== currentRow)
    ) {
      return true;
    }

    if (targetRow !== currentRow) {
      // check if marker is obstructed below
      if (targetRow > currentRow) {
        for (let i = currentRow + 1; i < targetRow; i++) {
          if (boardState[i][targetColumn] !== EMPTY) {
            return true;
          }
        }
      }
      // check if marker is obstructed above
      if (targetRow < currentRow) {
        for (let i = currentRow - 1; i > targetRow; i--) {
          if (boardState[i][targetColumn] !== EMPTY) {
            return true;
          }
        }
      }

      return false;
    }

    if (targetColumn !== currentColumn) {
      // check if marker is obstructed to the right
      if (targetColumn > currentColumn) {
        for (let i = currentColumn + 1; i < targetColumn; i++) {
          if (boardState[targetRow][i] !== EMPTY) {
            return true;
          }
        }
      }

      // check if marker is obstructed to the left
      if (targetColumn < currentColumn) {
        for (let i = currentColumn - 1; i > targetColumn; i--) {
          if (boardState[targetRow][i] !== EMPTY) {
            return true;
          }
        }
      }

      return false;
    }

    console.error(
      `somehow, code evaded all checks.  attempting move to ${targetRow}, ${targetColumn}`
    );
    return true;
  };

  const removeCurrentHighlight = () => {
    const el = document.getElementById(`${selectedMarker}-marker`);
    if (el) {
      el?.classList.remove("highlight");
    }
  };

  return (
    <div className="App">
      <h1 className="title">Hnefatafl</h1>
      <h3 className="subtitle">
        {activePlayer === DARK ? "Black to move" : "White to move"}
      </h3>
      {makeBoard(BOARD_WIDTH, BOARD_HEIGHT)}
    </div>
  );
}

export default App;
