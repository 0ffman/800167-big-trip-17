import { generatePoint } from '../mock.js';

export default class PointsModel {
  #points = Array.from({length: 20}, generatePoint);

  get points() {
    return this.#points;
  }
}
