import { CoordinatePair } from "./types/CoordinatePair";
import { BOARD_HEIGHT, BOARD_WIDTH, CORNER, CENTER, NORMAL } from "./constants";
import { SquareVariety } from "./types";

export const getSquareVariety = (coordinates: CoordinatePair): SquareVariety => {
  if (isCornerSquare(coordinates)) {
    return CORNER;
  }
    if (isCenterSquare(coordinates)) {
      return CENTER;
    }
  return NORMAL;
};

function isCornerSquare(
  coordinates: CoordinatePair,
  boardWidth = BOARD_WIDTH,
  boardHeight = BOARD_HEIGHT
): boolean {
  const isTopOrBottomRow =
    coordinates.row === 0 || coordinates.row === BOARD_HEIGHT - 1;
  const isLeftOrRightCol =
    coordinates.col === 0 || coordinates.col === BOARD_WIDTH - 1;

  if (isLeftOrRightCol && isTopOrBottomRow) {
    return true;
  }
  return false;
}

function isCenterSquare(
  coordinates: CoordinatePair,
  boardWidth = BOARD_WIDTH,
  boardHeight = BOARD_HEIGHT
) {
  const isCenterRow = Math.floor((boardHeight / 2)) === coordinates.row;
  console.log(isCenterRow);
  const isCenterCol = Math.floor((boardWidth /2 )) === coordinates.col;
  if(isCenterCol && isCenterRow){
      return true;
  }
  return false;
}
