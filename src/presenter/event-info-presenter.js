import {render, remove} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripCostView from '../view/trip-cost-view.js';

export default class EventInfoPresenter {
  #tripInfoComponent = null;
  #tripCostComponent = null;
  #elementContainer = null;
  #pointsModel = null;

  constructor(elementContainer, pointsModel) {
    this.#elementContainer = elementContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#tripInfoComponent = new TripInfoView(this.#pointsModel);
    this.#tripCostComponent = new TripCostView(this.#pointsModel);

    render(this.#tripInfoComponent, this.#elementContainer);
    render(this.#tripCostComponent, this.#elementContainer);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
    remove(this.#tripCostComponent);
  };
}
