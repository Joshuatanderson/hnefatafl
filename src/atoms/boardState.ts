import { atom } from "jotai";

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

export const boardAtom = atom(INIT_BOARD_STATE)