import { TYPE_OF_POINT } from '../const.js';
import SmartView from './smart-view.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
// import he from 'he';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

export const createEventEditTypesTemplate = (currentType) => {
  const types = TYPE_OF_POINT;
  return types.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');
};

const createEventEditOfferTemplate = (arrayOffers) => {
  if (arrayOffers) {
    arrayOffers.forEach((item) => {item.titleForTag = item.title.split(' ')[0];});
    arrayOffers.map((array) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-"${array.titleForTag}"-1" type="checkbox" name="event-offer-${array.titleForTag}">
  <label class="event__offer-label" for="event-offer-${array.titleForTag}-1">
    <span class="event__offer-title">${array.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${array.price}</span>
  </label>
</div>` ).join('');
  }
};


const createEventNewPhotosTemplate = (arrayOfPictures) => {
  const arrayOfPicture = arrayOfPictures;
  return arrayOfPicture.map((array) => `<img class="event__photo" src="${array.src}" alt="${array.description}">`).join('');
};

export const BLANK_EVENT = {
  startDate: dayjs().format('DD/MM/YYYY'),
  endDate: dayjs().format('DD/MM/YYYY'),
  pictures: [{src:'http://picsum.photos/300/200?r=5', description: 'desc 1'}],
  type: 'bus',
  offer:{
    type: 'taxi',
    offers: [
      {title: 'desc twenty two',
        titleForTeg: 'desc',
        price: 500},
    ],
  },
  destination: 'Barcelona',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  price: 0,
  isFavorite: false
};

const createFormEditTemplate = (event) => {
  const {type, destination, price, startDate, endDate, offers} = event;
  const {name, description, pictures} = destination;
  const typesTemplate = createEventEditTypesTemplate(type);
  const offersTemplate = createEventEditOfferTemplate(offers);
  console.log(offersTemplate);
  const photosTemplate = createEventNewPhotosTemplate(pictures);
  const isSubmitDisabled = price && (price > 0);
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post" autocomplete="off">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="./img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${name} list="destination-list-1" required>
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startDate).format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(endDate).format('DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" step="1" name="event-price" value=${price}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? '' : 'disabled'}>Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${offersTemplate}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
            ${photosTemplate}
            </div>
          </div>

        </section>
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

  static parseEventToData = (event) => {
    const data = {...event};
    return data;
  };

  static parseDataToEvent = (data) => {
    const event = {...data};
    return event;
  }
}

