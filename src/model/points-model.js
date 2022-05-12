import { generatePoint } from '../mock.js';

const POINTS_COUNT = 20;

export default class PointsModel {
  #points = Array.from({length: POINTS_COUNT}, generatePoint);

  get points() {
    return this.#points;
  }
}
