import {atom} from "jotai";
import {useAtomDevtools} from "jotai/devtools";
import { DARK, LIGHT } from "../constants";

export const activePlayerAtom = atom<typeof DARK | typeof LIGHT>(DARK);

export const useActivePlayerDevTools = () => {
    useAtomDevtools(activePlayerAtom);
}