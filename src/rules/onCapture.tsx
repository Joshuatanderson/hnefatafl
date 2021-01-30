import { CoordinatePair } from "../types/CoordinatePair";
import { gameOutcomeAtom } from "../atoms/gameOutcome";
import { useAtom } from "jotai";
import { DARK_WON, KING } from "../constants";
import { BoardState, SpaceValue } from "../types";

export function useOnCapture(
  coordinates: CoordinatePair,
  boardState: BoardState,
) {
  const [gameOutcome, setGameOutcome] = useAtom(gameOutcomeAtom);
  const capturedPiece = boardState[coordinates.row][coordinates.col]
  if (capturedPiece === KING) {
    setGameOutcome(DARK_WON);
  }
}
