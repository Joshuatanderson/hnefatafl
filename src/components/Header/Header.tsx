import React, { Fragment } from "react";
import { DARK, LIGHT } from "../../constants";
import "./Header.scss";

interface Header {
  activePlayer: typeof DARK | typeof LIGHT;
}

const Header = ({ activePlayer }: Header) => {
  return (
    <Fragment>
      <h1 className="title">Hnefatafl</h1>
      <h3 className="subtitle">
        {activePlayer === DARK ? "Black to move" : "White to move"}
      </h3>
    </Fragment>
  );
};

export default Header;
