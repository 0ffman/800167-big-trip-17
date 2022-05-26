import { render, RenderPosition } from '../framework/render.js';
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
  #sortComponent = new SortView();
  #noPointComponent = new NoPointView();

  constructor(eventContainer, pointsModel) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#eventPoints = [...this.#pointsModel.points];

    this.#renderEventSection();
  };

  #handleModeChange = () => {
    this.#eventItemPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleEventChange = (updatedEvent) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedEvent);
    this.#eventItemPresenter.get(updatedEvent.id).init(updatedEvent);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const eventItemPresenter = new EventItemPresenter(this.#tripListComponent.element, this.#handleEventChange, this.#handleModeChange);
    eventItemPresenter.init(point);
    this.#eventItemPresenter.set(point.id, eventItemPresenter);
  };

  #renderPoints = (from, to) => {
    this.#eventPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEventList = () => {
    render(this.#tripListComponent, this.#eventContainer);
    this.#renderPoints(0, this.#eventPoints.length);
  };

  #clearEventList = () => {
    this.#eventItemPresenter.forEach((presenter) => presenter.destroy());
    this.#eventItemPresenter.clear();
  };

  #renderEventSection = () => {
    if (this.#eventPoints.length) {
      this.#renderSort();
      this.#renderEventList();
    } else {
      this.#renderNoPoints();
    }
  };

}
