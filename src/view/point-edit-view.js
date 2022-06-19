import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getSlashFullDate} from '../utils.js';
import { TYPE_VALUES } from '../data.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const createOfferTemplate = ({id, title, price}, isDisabled) => (
  `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
          id="event-offer-${title.toLowerCase().replace(' ', '-')}-${id}"
          type="checkbox"
          name="event-offer-${title.toLowerCase().replace(' ', '-')}"
          value="${id}"
          ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-${title.toLowerCase().replace(' ', '-')}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
  </div>`
);

const createOffersTemplate = (eventTypeOffers, eventOffers, isDisabled) => (
  `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${eventTypeOffers.map((offer) => createOfferTemplate(offer, eventOffers, isDisabled)).join('')}
      </div>
    </section>
  `
);

const createEventTypesTemplate = (types, eventType, isDisabled) => (
  `<fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

      ${types.map((type) => `
          <div class="event__type-item">
            <input id="event-type-${type}-1"
                   class="event__type-input  visually-hidden"
                   type="radio"
                   name="event-type"
                   value="${type}"
                   ${type === eventType ? 'checked' : ''}
                   ${isDisabled ? 'disabled' : ''}
                   >
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.substring(1)}</label>
          </div>
        `).join('')}
    </fieldset>
  `
);

const createDestinationsTemplate = (destinations, destinationName, isDisabled) => (
  `
    ${destinations.map((destination) => `<option value="${destination}" ${destination === destinationName ? 'selected="selected"' : ''} ${isDisabled ? 'disabled' : ''}></option>`).join('')}
  `
);

const createDestinationPhotosTemplate = (destinationPhotos) => (
  `
    ${destinationPhotos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')}
  `
);


const createPointEditTemplate = (point, offersValue, destinationsValue) => {
  const {
    basePrice,
    dateFrom ,
    dateTo,
    destination,
    offers,
    type,
    isEdit,
    isDisabled,
    isSaving,
    isDeleting
  } = point;

  const dateFromSlashes = dateFrom  ? getSlashFullDate(dateFrom) : '';
  const dateToSlashes = dateTo ? getSlashFullDate(dateTo) : '';

  const eventTypeOffers = offersValue.find((offer) => offer.type === type) ? offersValue.find((offer) => offer.type === type).offers : [];
  const destinationNames = destinationsValue.map((item) => item['name']);

  const offersTemplate = createOffersTemplate(eventTypeOffers, offers, isDisabled);
  const eventTypesTemplate = createEventTypesTemplate(TYPE_VALUES, type, isDisabled);
  const destinationsTemplate = createDestinationsTemplate(destinationNames, destination.name, isDisabled);
  const destinationPhotosTemplate = createDestinationPhotosTemplate(destination.pictures);

  const buttonEditTemplate = isEdit
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    : '';

  const isDeletingValue = isDeleting ? 'Deleting...' : 'Delete';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="${type ? `img/icons/${type}.png` : ''}" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden"
                   id="event-type-toggle-1"
                   type="checkbox"
                   ${isDisabled ? 'disabled' : ''}>
            <div class="event__type-list">
              ${eventTypesTemplate}
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination"
                   id="event-destination-1"
                   type="text"
                   name="event-destination"
                   value="${destination.name}"
                   list="destination-list-1"
                   required
                   autocomplete="off"
                   ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time event__input--start"
                   id="event-start-time-1"
                   type="text"
                   name="event-start-time"
                   value="${dateFromSlashes}"
                   required
                   autocomplete="off"
                   ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time event__input--end"
                   id="event-end-time-1"
                   type="text"
                   name="event-end-time"
                   value="${dateToSlashes}"
                   required
                   autocomplete="off"
                   ${isDisabled ? 'disabled' : ''}>
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price"
                   id="event-price-1"
                   type="number"
                   name="event-price"
                   value="${basePrice}"
                   min="1"
                   step="1"
                   autocomplete="off"
                   ${isDisabled ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
          <button
              class="event__reset-btn ${isEdit ? 'event__reset-btn--delete' : 'event__reset-btn--cancel'}"
              type="reset"
          >
              ${isEdit ? isDeletingValue : 'Cancel'}
          </button>
          ${buttonEditTemplate}
        </header>
        <section class="event__details">
          ${offersTemplate}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${he.encode(destination.description)}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destinationPhotosTemplate}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};


export default class PointEditView extends AbstractStatefulView {
  #datepicker = null;
  #pointsModel = null;

  constructor(point, pointsModel) {
    super();
    this._state = PointEditView.parsePointToState(point);
    this.#pointsModel = pointsModel;

    this.#setInnerHandlers();
    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  }

  get template() {
    return createPointEditTemplate(this._state,this.#pointsModel ? this.#pointsModel.offers : [], this.#pointsModel ? this.#pointsModel.destinations : []);
  }

  setEditClickHandler = (callback) => {
    if ( this.element.querySelector('.event__rollup-btn') ) {
      this._callback.editClick = callback;
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    }
  };

  setCancelClickHandler = (callback) => {
    if ( this.element.querySelector('.event__reset-btn--cancel') ) {
      this._callback.editClick = callback;
      this.element.querySelector('.event__reset-btn--cancel').addEventListener('click', this.#editClickHandler);
    }
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseStateToPoint(this._state));
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  };

  setDeleteClickHandler = (callback) => {
    if ( this.element.querySelector('.event__reset-btn--delete') ) {
      this._callback.deleteClick = callback;
      this.element.querySelector('.event__reset-btn--delete').addEventListener('click', this.#formDeleteClickHandler);
    }
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEditView.parseStateToPoint(this._state));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
    this.setCancelClickHandler(this._callback.editClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #pointTypeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
    });
  };

  #pointDestinationToggleHandler = (evt) => {
    evt.preventDefault();
    const targetValue = evt.target.value;
    const destinationItems = this.#pointsModel ? this.#pointsModel.destinations : [];
    const destinationValue = destinationItems.find((destination) => destination.name === targetValue);
    this.updateElement({
      destination: destinationValue ? destinationValue : destinationItems[0]
    });
  };

  #pointOffersToggleHandler = (evt) => {
    evt.preventDefault();
    const selectedOffers = this._state.offers;
    const targetValue = parseInt(evt.target.value, 10);
    if ( evt.target.checked ) {
      selectedOffers.push(targetValue);
    } else {
      const myIndex = selectedOffers.indexOf(targetValue);
      if ( myIndex !== -1 ) {
        selectedOffers.splice(myIndex, 1);
      }
    }
    this._setState({
      offers: selectedOffers,
    });
  };

  #pointPriceToggleHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    this.#setDateToDatepicker();
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    this.#setDateFromDatepicker();
  };

  #setDateFromDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.event__input--start'),
      {
        allowInput: true,
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler
      }
    );
  };

  #setDateToDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.event__input--end'),
      {
        allowInput: true,
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      }
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#pointTypeToggleHandler);

    this.element.querySelector('.event__field-group.event__field-group--destination')
      .addEventListener('change', this.#pointDestinationToggleHandler);

    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#pointOffersToggleHandler);

    this.element.querySelector('.event__field-group.event__field-group--price')
      .addEventListener('change', this.#pointPriceToggleHandler);
  };

  static parsePointToState = (point) => ({...point,
    isEdit: Object.prototype.hasOwnProperty.call(point, 'id'),
    isDisabled: false,
    isSaving: false,
    isDeleting: false
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isEdit;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

}
