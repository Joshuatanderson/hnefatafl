import { atom } from "jotai";
import {IN_PROGRESS, DARK_WON, LIGHT_WON} from "../constants";

export const gameOutcomeAtom = atom<typeof DARK_WON | typeof LIGHT_WON | typeof IN_PROGRESS>("IN_PROGRESS")