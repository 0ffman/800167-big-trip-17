import { render } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointView from '../view/no-point-view.js';
import EventItemPresenter from './event-item-presenter';
import { updateItem } from '../utils.js';

export default class TripPresenter {
  #eventContainer = null;
  #pointsModel = null;
  #eventPoints = [];
  #eventItemPresenter = new Map();

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

  #handleEventChange = (updatedEvent) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedEvent);
    this.#eventItemPresenter.get(updatedEvent.id).init(updatedEvent);
  };

  #renderPoint = (point) => {
    const eventItemPresenter = new EventItemPresenter(this.#tripListComponent.element);
    eventItemPresenter.init(point);
    this.#eventItemPresenter.set(point.id, eventItemPresenter);
  };

  #clearEventList = () => {
    this.#eventItemPresenter.forEach((presenter) => presenter.destroy());
    this.#eventItemPresenter.clear();
  };
}
