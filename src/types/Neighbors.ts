import { CoordinatePair } from "./CoordinatePair";
import { SpaceValue } from "./SpaceValue";

export interface Neighbors {
  north?: Neighbor;
  south?: Neighbor;
  east?: Neighbor;
  west?: Neighbor;
}

interface Neighbor {
  spaceValue: SpaceValue;
  coordinates: CoordinatePair;
}
