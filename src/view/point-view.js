import AbstractView from '../framework/view/abstract-view.js';
import {humanizeDate, getHoursMinutesDate, getYearMonthDate, getFullDate} from '../utils.js';
import dayjs from 'dayjs';
import he from 'he';


const createOfferTemplate = (offer) => (
  `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`
);

const createOffersTemplate = (offers) => offers.map(createOfferTemplate).join('');

const createPointTemplate = (point, offerItems) =>
{
  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = point;

  const dateFromHumanize = dateFrom ? humanizeDate(dateFrom) : '';

  const dateFromHoursMinutes = dateFrom ? getHoursMinutesDate(dateFrom) : '';

  const dateFromYearMonth = dateFrom ? getYearMonthDate(dateFrom) : '';

  const dateFromFull = dateFrom ? getFullDate(dateFrom) : '';

  const dateToHoursMinutes = dateTo ? getHoursMinutesDate(dateTo) : '';

  const dateToFull = dateTo ? getFullDate(dateTo) : '';

  const HOURS_IN_DAY = 24;


  const calculateEventDuration = (from = null, to = null) => {
    const dateIn = dayjs(from);
    const dateOut = dayjs(to);
    let hours = dateOut.diff(dateIn, 'hours');
    const days = Math.floor(hours / HOURS_IN_DAY);
    hours = hours - (days * HOURS_IN_DAY);

    return `${days}D ${hours}M`;
  };

  const favoriteClassName = isFavorite ? 'event__favorite-btn event__favorite-btn--active' : 'event__favorite-btn';

  const eventTypeOffer = offerItems.find((offer) => offer.type === type);
  const eventOffers = eventTypeOffer ? eventTypeOffer.offers.filter((v) => offers.some((v2) => v.id === v2)) : [];

  const offersTemplate = createOffersTemplate(eventOffers);

  return(
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFromYearMonth}">${dateFromHumanize}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="${type ? `img/icons/${type}.png` : ''}" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination ? he.encode(destination.name) : ''}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFromFull}">${dateFromHoursMinutes}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateToFull}">${dateToHoursMinutes}</time>
          </p>
          <p class="event__duration">${calculateEventDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};


export default class PointView extends AbstractView {
  #point = null;
  #pointsModel = null;

  constructor(point, pointsModel) {
    super();
    this.#point = point;
    this.#pointsModel = pointsModel;
  }

  get template() {
    return createPointTemplate(this.#point, this.#pointsModel ? this.#pointsModel.offers : []);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-icon').addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

}
