import React, { Fragment } from "react";

import { DARK, DARK_WON, IN_PROGRESS, LIGHT, LIGHT_WON } from "../../constants";
import { gameOutcomeAtom } from "../../atoms/gameOutcome";
import "./Header.scss";
import { useAtom } from "jotai";

interface Header {
  activePlayer: typeof DARK | typeof LIGHT;
}

const Header = ({ activePlayer }: Header) => {
  const [gameOutcome] = useAtom(gameOutcomeAtom);
  return (
    <Fragment>
      <h1 className="title">Hnefatafl</h1>
      <h3 className="subtitle">
        {gameOutcome === IN_PROGRESS &&
          (activePlayer === DARK ? "Black to move" : "White to move")}
        {gameOutcome === DARK_WON && "Black wins!"}
        {gameOutcome === LIGHT_WON && "White wins!"}
      </h3>
    </Fragment>
  );
};

export default Header;
