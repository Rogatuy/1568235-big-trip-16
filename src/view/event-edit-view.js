import {TYPE_OF_POINT, AUTHORIZATION, END_POINT} from '../const.js';
import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import ApiService from '../api-service.js';
import {nanoid} from 'nanoid';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const api = new ApiService(END_POINT, AUTHORIZATION);


export const createEventEditTypesTemplate = (currentType, isDisabled) => {
  const types = TYPE_OF_POINT;
  return types.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : '' } ${isDisabled ? 'disabled' : '' }>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');
};

const createEventEditOfferTemplate = (arrayOffers, isDisabled) => {
  let offers = '';
  if (arrayOffers.length !== 0) {
    arrayOffers.forEach((array) => {
      array.isChecked = false;
      array.titleForTag = array.title.split(' ')[0];
      offers += `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${array.titleForTag}-${array.id}" type="checkbox" name="event-offer-${array.titleForTag}" ${isDisabled ? 'disabled' : '' } ${array.isChecked ? 'checked' : ''} value="${array.id}">
          <label class="event__offer-label" for="event-offer-${array.titleForTag}-${array.id}">
          <span class="event__offer-title">${array.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${array.price}</span>
        </label>
      </div>`;
    });
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers}
    </div>
    </section>`;} else {
    return ' ';}
};

const createDestinationOption = () => {
  api.destination.then((res) => {
    let destinationOption = '';
    res.forEach((item) => {destinationOption += `<option>${item.name}</option>`;});
    return destinationOption;});
};

export const BLANK_EVENT = {
  startDate: new Date(),
  endDate: new Date(),
  id: nanoid(),
  type: 'bus',
  offers: [
    {title: 'desc twenty two',
      id: 0,
      price: 500,
      isChecked: false
    },
  ],
  destination: {
    name: 'Vien',
  },
  price: 0,
  isFavorite: false
};

const createDescription = (destinationName) => {
  api.destination.then((res) => {
    let destination = '';
    const currentObjectDestination = res.find((array) => array.name === destinationName);

    const photosTemplate = currentObjectDestination.pictures.map((array) => `<img class="event__photo" src="${array.src}" alt="${array.description}">`).join('');
    destination = `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${currentObjectDestination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${photosTemplate}
      </div>
    </div>
  </section>`;
  console.log(destination);
    return destination;});
};


const createFormEditTemplate = (event = BLANK_EVENT) => {
  const {type, destination, price, startDate, endDate, offers, isDisabled, isSaving, isDeleting} = event;
  const {name} = destination;
  const typesTemplate = createEventEditTypesTemplate(type, isDisabled);
  const offersTemplate = createEventEditOfferTemplate(offers, isDisabled);
  const isSubmitDisabled = price && (price > 0);
  const destinationOptionTemplate = createDestinationOption();
  const descriptionTemplate = createDescription(name);
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${name} list="destination-list-1" required ${isDisabled ? 'disabled' : '' }>
          <datalist id="destination-list-1">
            ${destinationOptionTemplate}
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" step="1" name="event-price" value=${price} ${isDisabled ? 'disabled' : '' }>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled || isDisabled ? '' : 'disabled'}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
          ${offersTemplate}
          ${descriptionTemplate}
      </section>
    </form>
  </li>`;
};

export default class EventEditView extends SmartView {
  #startdatepicker = null;
  #enddatepicker = null;

  constructor(event = BLANK_EVENT) {
    super();
    this._data = EventEditView.parseEventToData(event);

    this._lastFocus = null;
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }

  get template() {
    return createFormEditTemplate(this._data);
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
    if (this._lastFocus) {
      document.querySelector(`#${this._lastFocus}`).focus();
      this._lastFocus = null;
    }
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
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._lastFocus = evt.target.id;
    this.updateData({
      price: evt.target.value,
    });
  }

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.parseDataToEvent(this._data));
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventEditView.parseDataToEvent(this._data));
  }

  setOfferClickHandler = (callback) => {
    this._callback.offerClick = callback;
    this.element.querySelectorAll('.event__offer-checkbox').forEach((element) =>{element.addEventListener('click', this.#offerClickHandler);});
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

