import React, { useEffect } from "react";
import { useAtom } from "jotai";
import produce from "immer";

import { Neighbors, SpaceValue } from "./types";
import { DARK, LIGHT, EMPTY, BOARD_HEIGHT, BOARD_WIDTH } from "./constants";
import "./App.scss";
import {
  activePlayerAtom,
  shouldAlertUserAtom,
  boardAtom,
  selectedMarkerAtom,
  lastMoveAtom,
} from "./atoms";
import { CoordinatePair } from "./types/CoordinatePair";
import Square from "./components/Square/Square";
import Header from "./components/Header/Header";
import { useAtomDevtools } from "jotai/devtools";
import {} from "./atoms/shouldAlertUser";

function App() {
  const [boardState, updateBoardState] = useAtom(boardAtom);
  const [lastMove, updateLastMove] = useAtom(lastMoveAtom);
  const [selectedMarker, updateSelectedMarker] = useAtom(selectedMarkerAtom);
  const [activePlayer, updateActivePlayer] = useAtom(activePlayerAtom);
  const [shouldAlertUser, updateShouldAlertUser] = useAtom(shouldAlertUserAtom);

  // init devtools
  useAtomDevtools(activePlayerAtom, "active Player");
  useAtomDevtools(boardAtom, "board state");
  useAtomDevtools(selectedMarkerAtom, "selected marker");
  useAtomDevtools(shouldAlertUserAtom, "error state markers");
  useAtomDevtools(lastMoveAtom, "last move");

  // run capture check code on each neighbor after move registers
  useEffect(() => {
    if (!lastMove) {
      return;
    }
    const neighbors = getNeighbors(lastMove);
    // check each neighbor of the placed marker to see if it was captured
    for (const neighbor in neighbors as Neighbors) {
      // TODO: Oh son of a I'M SO SORRY! (for the type atrocities committed on this soil)
      const coordinates = neighbors[neighbor as keyof Neighbors]?.coordinates;

      const spaceValue = neighbors[neighbor as keyof Neighbors]?.spaceValue;
      if (
        shouldBeCaptured(
          coordinates as CoordinatePair,
          spaceValue as SpaceValue
        )
      ) {
        console.log("capture piece");
        handleCapture(coordinates as CoordinatePair);
      }
    }
    // TODO: set shouldAlertUser to autoremove
    updateShouldAlertUser((base) => []);
    updateActivePlayer(() => (activePlayer === DARK ? LIGHT : DARK));
  }, [lastMove]);

  const makeBoard = (BOARD_WIDTH: number, BOARD_HEIGHT: number) => {
    const boardContents: JSX.Element[][] = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const row: JSX.Element[] = [];
      for (let j = 0; j < BOARD_WIDTH; j++) {
        row.push(
          <Square
            handleMove={handleMove}
            spaceValue={boardState[i]?.[j]}
            handleClickMarker={handleClickMarker}
            coordinates={{ row: i, col: j }}
            shouldAlertUser={shouldAlertUser.includes(`${i}-${j}`)}
            id={`${i}-${j}`}
            key={`${i}-${j}`}
            isSelected={selectedMarker === `${i}-${j}`}
          />
        );
      }
      boardContents.push(row);
    }
    return <div className="board">{boardContents}</div>;
  };

  const getNeighbors = ({ row, col }: CoordinatePair): Neighbors => {
    const neighbors: Neighbors = {};
    if (areValidCoordinates({ row: row - 1, col })) {
      console.log(`North: ${boardState[row - 1]?.[col]}`);
      neighbors.north = {
        spaceValue: boardState[row - 1]?.[col],
        coordinates: { row: row - 1, col },
      };
    }
    if (areValidCoordinates({ row: row + 1, col })) {
      neighbors.south = {
        spaceValue: boardState[row + 1]?.[col],
        coordinates: { row: row + 1, col },
      };
    }
    if (areValidCoordinates({ row, col: col + 1 })) {
      neighbors.east = {
        spaceValue: boardState[row]?.[col + 1],
        coordinates: { row, col: col + 1 },
      };
    }
    if (areValidCoordinates({ row, col: col - 1 })) {
      neighbors.west = {
        spaceValue: boardState[row]?.[col - 1],
        coordinates: { row, col: col - 1 },
      };
    }
    console.log(neighbors);

    return neighbors;
  };

  const areValidCoordinates = (coordinates: CoordinatePair): boolean => {
    if (coordinates.row >= BOARD_HEIGHT || coordinates.row < 0) {
      return false;
    }
    if (coordinates.col >= BOARD_WIDTH || coordinates.col < 0) {
      return false;
    }
    return true;
  };

  const hasEmptyNeighbors = (coordinates: CoordinatePair): boolean => {
    const neighbors = getNeighbors(coordinates);
    for (let prop in neighbors) {
      if (neighbors[prop as keyof Neighbors]?.spaceValue === EMPTY) {
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

  const shouldBeCaptured = (
    coordinates: CoordinatePair,
    spaceValue: SpaceValue
  ): boolean => {
    if (spaceValue === activePlayer || spaceValue === EMPTY) {
      return false;
    }

    const neighbors = getNeighbors(coordinates);

    if (
      (neighbors.north?.spaceValue === (activePlayer || undefined) &&
        neighbors.south?.spaceValue === (activePlayer || undefined)) ||
      (neighbors.east?.spaceValue === (activePlayer || undefined) &&
        neighbors.west?.spaceValue === (activePlayer || undefined))
    ) {
      return true;
    }
    return false;
  };

  const handleCapture = async ({ row, col }: CoordinatePair) => {
    await updateBoardState((base) =>
      produce(base, (draft) => {
        draft[row][col] = EMPTY;
      })
    );
  };

  const selectMarker = ({ row, col }: CoordinatePair) => {
    updateSelectedMarker(`${row}-${col}`);
  };

  /**
   *
   * @param coordinatePair - coordinates to move to
   */

  const handleMove = async ({ row, col }: CoordinatePair) => {
    if (!selectedMarker) {
      return;
    }
    const [currentRow, currentCol] = selectedMarker
      .split("-")
      .map((coordinate) => parseInt(coordinate));
    const moveIsLegal = isMoveLegal(
      { row, col },
      { row: currentRow, col: currentCol }
    );
    if (moveIsLegal) {
      updateBoardState((base) =>
        produce(base, (draft) => {
          draft[row][col] = activePlayer;
          draft[currentRow][currentCol] = EMPTY;
        })
      );

      updateLastMove({ row, col });

      updateSelectedMarker(() => "");
    }
  };

  const isMoveLegal = (target: CoordinatePair, current: CoordinatePair) => {
    const moveIsObstructed = isMoveObstructed(target, current);
    const markerIsCorrectColor =
      boardState[current.row][current.col] === activePlayer;
    if (!moveIsObstructed && markerIsCorrectColor) {
      return true;
    }
    updateShouldAlertUser((base) => [`${target.row}-${target.col}`]);
    return false;
  };

  const isMoveObstructed = (
    target: CoordinatePair,
    current: CoordinatePair
  ): boolean => {
    // is move orthogonal, to a non-occupied space, or to itself?
    if (
      boardState[target.row][target.col] !== EMPTY ||
      (target.col === current.col && target.row === current.row) ||
      (target.col !== current.col && target.row !== current.row)
    ) {
      return true;
    }

    if (target.row !== current.row) {
      // check if marker is obstructed below
      if (target.row > current.row) {
        for (let i = current.row + 1; i < target.row; i++) {
          if (boardState[i][target.col] !== EMPTY) {
            return true;
          }
        }
      }
      // check if marker is obstructed above
      if (target.row < current.row) {
        for (let i = current.row - 1; i > target.row; i--) {
          if (boardState[i][target.col] !== EMPTY) {
            return true;
          }
        }
      }

      return false;
    }

    if (target.col !== current.col) {
      // check if marker is obstructed to the right
      if (target.col > current.col) {
        for (let i = current.col + 1; i < target.col; i++) {
          if (boardState[target.row][i] !== EMPTY) {
            return true;
          }
        }
      }

      // check if marker is obstructed to the left
      if (target.col < current.col) {
        for (let i = current.col - 1; i > target.col; i--) {
          if (boardState[target.row][i] !== EMPTY) {
            return true;
          }
        }
      }

      return false;
    }

    console.error(
      `somehow, code evaded all checks.  attempting move to ${target.row}, ${target.col}`
    );
    return true;
  };

  return (
    <div className="App">
      <Header activePlayer={activePlayer} />
      {makeBoard(BOARD_WIDTH, BOARD_HEIGHT)}
    </div>
  );
}

export default App;
