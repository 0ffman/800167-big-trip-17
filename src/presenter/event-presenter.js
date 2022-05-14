import { render, replace } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import NoPointView from '../view/no-point-view.js';

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
    const pointComponent = new PointView(point);
    const pointEditComponent = new PointEditView(point);

    const replaceCardToPoint = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replacePointToCard = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replacePointToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replaceCardToPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      replacePointToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setEditClickHandler(() => {
      replacePointToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#tripListComponent.element);

  };
}
