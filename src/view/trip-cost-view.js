import AbstractView from '../framework/view/abstract-view.js';
import {getEventOffersType} from '../utils.JS';

const createCostTemplate = (points, offers) => {
  const totalCost = points.reduce((value, point) => {
    const pointTypeOffers = getEventOffersType(offers, point.type);
    const pointOffersValue = pointTypeOffers.reduce((accumulator, offer) => {
      if ( point.offers.includes(offer.id) ) {
        accumulator += offer.price;
      }
      return accumulator;
    }, 0);
    value += point.basePrice + pointOffersValue;
    return value;
  }, 0);

  return (
    `<p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span></p>`
  );
};


export default class TripCostView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createCostTemplate(this.#points ? this.#points.points : [], this.#points ? this.#points.offers : []);
  }
}
