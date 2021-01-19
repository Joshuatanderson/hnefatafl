import React, { useState, useEffect } from "react";
import classNames from "classnames";

import { DARK, EMPTY, IS_DARK, IS_LIGHT, LIGHT } from "../../constants";
import { SpaceValue } from "../../types";
import { CoordinatePair } from "../../types/CoordinatePair";
import "./Square.scss";

interface Square {
  spaceValue: SpaceValue;
  coordinates: CoordinatePair;
  handleMove: (coordinates: CoordinatePair) => void;
  handleClickMarker: (coordinates: CoordinatePair) => void;
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
    [IS_LIGHT]: spaceValue === LIGHT,
    [IS_DARK]: spaceValue === DARK,
    highlight: isSelected,
  });

  const squareClasses = classNames({
    square: true,
    "is-flashing": isFlashing
  })

  return (
    <div className={squareClasses} onClick={() => handleMove(coordinates)}>
      {spaceValue !== EMPTY && (
        <div
          id={`${coordinates.row}-${coordinates.col}-marker`}
          className={markerClasses}
          onClick={() => handleClickMarker(coordinates)}
        ></div>
      )}
    </div>
  );
};

export default Square;
