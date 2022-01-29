import {TYPE_OF_POINT} from '../const.js';
import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

export const BLANK_EVENT = {
  id: `${(Math.random() * 100).toFixed()}`,
  startDate: new Date(),
  endDate: new Date(),
  type: 'flight',
  offers: [],

  destination: {
    name: '',
    description: '',
  },
  price: 500,
  isFavorite: false
};

export const createEventEditTypesTemplate = (currentType, isDisabled) => {
  const types = TYPE_OF_POINT;
  return types.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : '' } ${isDisabled ? 'disabled' : '' }>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');
};

const createAvailableCitiesList = (destinations) => {
  let options = '';
  destinations.forEach((item) => { options += `<option value="${item.name}">${item.name}</option>`;});
  return options;
};

const createEventEditOfferTemplate = (type, pointOffers, offersList, isDisabled) => {
  const currentOffersList = offersList.find((array) => array.type === type);
  if (currentOffersList.offers.length === 0) {
    return '';
  }

  const isOfferChecked = (id) => pointOffers.some((pointOffer) => pointOffer.id === id);

  const offersForType = currentOffersList.offers.map( ({id, title, price}) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}-${id}" ${pointOffers && pointOffers.length >= 0 && isOfferChecked(id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${type}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`)
  ).join('');
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offersForType}
    </div>
    </section>`;
};

const createEventDestination = (destination) => {
  if (!destination) {
    return '';
  }
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${destination.description ? `<p class="event__destination-description">${destination.description}.</p>` : ''}
            ${destination.pictures ?  `<div class="event__photos-container">
                                      <div class="event__photos-tape">
                                        ${destination.pictures.map((photo) => (`<img class="event__photo" src="${photo.src}" alt="${photo.description}">`))}
                                      </div>
                                    </div>` : ''}
          </section>`;
};

const createFormEditTemplate = (event, destinations, offersList) => {
  const {type, destination, price, startDate, endDate, offers, isDisabled, isSaving, isDeleting} = event;
  const typesTemplate = createEventEditTypesTemplate(type, isDisabled);
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post" autocomplete="off">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="./img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : '' }>
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" ${isDisabled ? 'disabled' : '' }>
          <datalist id="destination-list-1">
            ${createAvailableCitiesList(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startDate).format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : '' }>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endDate).format('DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : '' }>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" step="1" name="event-price" value="${price}" ${isDisabled ? 'disabled' : '' }>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" >${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}> ${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
        <section class="event__details">
        ${createEventEditOfferTemplate(type, offers, offersList, isDisabled)}
        ${createEventDestination(destination)}
        </section>
    </form>
  </li>`;
};

export default class EventEditView extends SmartView {
  #startdatepicker = null;
  #enddatepicker = null;

  constructor( destinations, offers, event = BLANK_EVENT) {
    super();
    this._data = EventEditView.parseEventToData(event);

    this._offers = offers;
    this._destinations = destinations;

    this._isBlank =

    this._lastFocus = null;
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }

  get template() {
    return createFormEditTemplate(this._data, this._destinations, this._offers);
  }

  removeElement = () => {
    super.removeElement();
    this.#startdatepicker.destroy();
    this.#enddatepicker.destroy();
  }

  reset = (event) => {
    this.updateData(
      EventEditView.parseEventToData(event),
    );
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  setOfferClickHandler = (callback) => {
    this._callback.offerClick = callback;
    this.element.querySelectorAll('.event__offer-checkbox').forEach((element) =>{element.addEventListener('click', this.#offerClickHandler);});
  }

  #setStartDatepicker = () => {
    this.#startdatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.startDate,
        onChange: this.#startDateChangeHandler,
      }
    );
  }

  #setEndDatepicker = () => {
    this.#enddatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.endDate,
        minDate: this._data.startDate,
        onChange: this.#endDateChangeHandler,
      }
    );
  }

  #startDateChangeHandler = ([userDate]) => {
    this.updateData({
      startDate: userDate,
    });
  }

  #endDateChangeHandler = ([userDate]) => {
    this.updateData({
      endDate: userDate,
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('#event-destination-1')
      .addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    if(this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    }
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  #priceChangeHandler = (evt) => {
    const priceInputElement = this.element.querySelector('#event-price-1');
    const buttonSave = this.element.querySelector('.event__save-btn');

    if (priceInputElement.value > 0) {
      this.updateData({
        price: evt.target.value
      });
      buttonSave.disabled = false;
    }  else {
      buttonSave.disabled = true;
    }
  };


  #destinationChangeHandler = (evt) => {
    const destinationInputElement = this.element.querySelector('#event-destination-1');
    const destinationsListElement = this.element.querySelector('#destination-list-1');
    const buttonSave = this.element.querySelector('.event__save-btn');
    let optionFound = false;

    for (let i = 0; i < destinationsListElement.options.length; i++) {
      if (destinationInputElement.value === destinationsListElement.options[i].value) {
        optionFound = true;
        break;
      }
    }

    const getNewDestination = () => this._destinations.find((item) => item.name === destinationInputElement.value);
    const newDestination = getNewDestination();

    if (optionFound) {
      this.updateData({
        destination: {
          name: evt.target.value,
          description: newDestination.description,
          pictures: newDestination.pictures,
        }
      });
      buttonSave.disabled = false;
    }  else {
      buttonSave.disabled = true;
    }
  }

  #offerChangeHandler = (evt) => {
    const currentOffersList = this._offers.find((offer) => offer.type === this._data.type);
    const targetOfferTitle = evt.target.nextElementSibling.querySelector('.event__offer-title').textContent;
    const selectedOffer = currentOffersList.offers.find((offer) => offer.title === targetOfferTitle);
    if (evt.target.checked) {
      this._data.offers.push(selectedOffer);
    } else {
      const selectedOfferIndex = this._data.offers.findIndex((offer) => offer.title === selectedOffer.title);

      this._data.offers = [
        ...this._data.offers.slice(0, selectedOfferIndex),
        ...this._data.offers.slice(selectedOfferIndex + 1),
      ];
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.parseDataToEvent(this._data));
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventEditView.parseDataToEvent(this._data));
  }

  #offerClickHandler = (evt) => {
    this._callback.offerClick(evt.target);
  }

  static parseEventToData = (event) => {
    const data = {...event,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
    return data;
  };

  static parseDataToEvent = (data) => {
    const event = {...data};
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  }
}
