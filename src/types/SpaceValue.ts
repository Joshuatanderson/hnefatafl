import { DARK, LIGHT, EMPTY, KING } from "../constants";

export type SpaceValue =
  | typeof DARK
  | typeof LIGHT
  | typeof KING
  | typeof EMPTY;
