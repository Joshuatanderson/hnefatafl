import React, { useState, useEffect } from "react";
import classNames from "classnames";

import {
  DARK,
  EMPTY,
  IS_DARK,
  IS_LIGHT,
  LIGHT,
  KING,
  IS_KING,
  isLight,
  isDark,
} from "../../constants";
import { SpaceValue, SquareVariety } from "../../types";
import { CoordinatePair } from "../../types/CoordinatePair";
import "./Square.scss";

interface Square {
  spaceValue: SpaceValue;
  coordinates: CoordinatePair;
  handleMove: (coordinates: CoordinatePair) => void;
  handleClickMarker: (coordinates: CoordinatePair) => void;
  squareVariety: SquareVariety;
  shouldAlertUser: boolean;
  key: string;
  id: string;
  isSelected: boolean;
}

const Square = ({
  spaceValue,
  coordinates,
  handleMove,
  handleClickMarker,
  shouldAlertUser,
  isSelected,
}: Square) => {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (shouldAlertUser) {
      setIsFlashing(true);
    }
  }, [shouldAlertUser]);

  useEffect(() => {
    if (isFlashing === true) {
      setTimeout(() => setIsFlashing(false), 500);
    }
  }, [isFlashing]);

  const markerClasses = classNames({
    marker: true,
    [IS_LIGHT]: isLight(spaceValue),
    [IS_DARK]: isDark(spaceValue),
    [IS_KING]: spaceValue === KING,
    highlight: isSelected,
  });

  const squareClasses = classNames({
    square: true,
    "is-flashing": isFlashing,
  });

  return (
    <div className={squareClasses} onClick={() => handleMove(coordinates)}>
      {spaceValue !== EMPTY && (
        <div
          id={`${coordinates.row}-${coordinates.col}-marker`}
          className={markerClasses}
          onClick={() => handleClickMarker(coordinates)}
        >
          {spaceValue === KING && <div className="kingSymbol"></div>}
        </div>
      )}
    </div>
  );
};

export default Square;
