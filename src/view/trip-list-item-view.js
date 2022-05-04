import {createElement} from '../render.js';

const createTripListItemTemplate = () => '<li class="trip-events__item"></li>';

export default class TripListItemView {
  getTemplate() {
    return createTripListItemTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
