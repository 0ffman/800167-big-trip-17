import {render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class EventItemPresenter {
  #pointListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  constructor(eventListContainer) {
    this.#pointListContainer = eventListContainer;
  }

  init = (point) => {
    this.#point = point;

    this.#pointComponent = new PointView(point);
    this.#pointEditComponent = new PointEditView(point);

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setEditClickHandler(this.#handleFormSubmit);

    render(this.#pointComponent, this.#pointListContainer);
  };

  #replaceCardToPoint = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replacePointToCard = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replacePointToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToPoint();
  };

  #handleFormSubmit = () => {
    this.#replacePointToCard();
  };
}
