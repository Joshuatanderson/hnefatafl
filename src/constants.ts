export const KING = 3;
export const DARK = 2;
export const LIGHT = 1;
export const EMPTY = 0;

export const BOARD_WIDTH = 11;
export const BOARD_HEIGHT = 11;

export const isLight = (value: number) => value === KING || value === LIGHT;
export const isDark = (value: number) => value === DARK;

export const IS_LIGHT = "isLight";
export const IS_DARK = "isDark";
export const IS_KING = "isKing";

export const CORNER = "CORNER";
export const CENTER = "CENTER";
export const NORMAL = "NORMAL";

export const IN_PROGRESS = "IN_PROGRESS";
export const LIGHT_WON = "LIGHT_WON";
export const DARK_WON = "DARK_WON";
