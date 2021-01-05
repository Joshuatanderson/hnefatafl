import { SpaceValue } from "./SpaceValue";

export interface Neighbors {
  north: SpaceValue | undefined;
  south: SpaceValue | undefined;
  east: SpaceValue | undefined;
  west: SpaceValue | undefined;
}
