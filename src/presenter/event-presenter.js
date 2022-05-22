import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointView from '../view/no-point-view.js';
import EventItemPresenter from './event-item-presenter';

export default class TripPresenter {
  #eventContainer = null;
  #pointsModel = null;
  #eventPoints = [];

  #tripListComponent = new TripListView();

  init = (eventContainer, pointsModel) => {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
    this.#eventPoints = [...this.#pointsModel.points];


    if (this.#eventPoints.length) {
      render(new SortView(), this.#eventContainer);
      render(this.#tripListComponent, this.#eventContainer);

      for ( const point of this.#eventPoints) {
        this.#renderPoint(point);
      }
    } else {
      render(new NoPointView(), this.#eventContainer);
    }


  };


  #renderPoint = (point) => {
    const eventItemPresenter = new EventItemPresenter(this.#tripListComponent.element);
    eventItemPresenter.init(point);
  };
}
