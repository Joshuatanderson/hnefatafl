import {atom} from "jotai";
import { DARK, LIGHT } from "../constants";

export const activePlayerAtom = atom<typeof DARK | typeof LIGHT>(DARK);