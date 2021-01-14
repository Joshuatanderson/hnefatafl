import React from "react";
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
  key: string;
  id: string;
  isSelected: boolean
}

const Square = ({
  spaceValue,
  coordinates,
  handleMove,
  handleClickMarker,
  isSelected
}: Square) => {
  const markerClasses = classNames({
    marker: true,
    [IS_LIGHT]: spaceValue === LIGHT,
    [IS_DARK]: spaceValue === DARK,
    highlight: isSelected
  });

  return (
    <div className="square" onClick={() => handleMove(coordinates)}>
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
