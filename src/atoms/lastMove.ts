import { atom } from "jotai";
import { CoordinatePair } from "../types/CoordinatePair";

export const lastMoveAtom = atom<CoordinatePair | undefined>(undefined);
