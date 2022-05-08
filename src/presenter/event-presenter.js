import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  #eventContainer = null;
  #pointsModel = null;
  #eventPoints = [];

  #tripListComponent = new TripListView();

  init = (eventContainer, pointsModel) => {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
    this.#eventPoints = [...this.#pointsModel.points];

    render(new SortView(), this.#eventContainer);
    render(this.#tripListComponent, this.#eventContainer);


    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderPoint(this.#eventPoints[i]);
    }

  };

  #renderPoint = (point) => {
    const pointComponent = new PointView(point);
    const pointEditComponent = new PointEditView(point);

    const replaceCardToPoint = () => {
      this.#tripListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replacePointToCard = () => {
      this.#tripListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replacePointToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event--edit').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replacePointToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripListComponent.element);

  };
}
