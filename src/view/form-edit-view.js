import {TYPE_OF_POINT} from '../mock/event.js';
import {createEventOfferTemplate} from './form-new-view.js';
import SmartView from './smart-view.js';

export const createEventEditTypesTemplate = (currentType) => {
  const types = TYPE_OF_POINT;
  return types.map((type) => `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');
};

export const BLANK_EVENT = {
  dateDayOutsideTegEvent: null,
  dateDayInsideTegEvent: null,
  startDateOutsideTegEvent: null,
  startDateInsideTegEvent: null,
  startDateInsideTegFormEdit: null,
  endDateOutsideTegEvent: null,
  endDateInsideTegEvent: null,
  endDateInsideTegFormEdit: null,
  timeDifference: null,
  pictures: [],
  type: 'bus',
  offer: {},
  destination: '',
  description: '',
  price: null,
  isFavorite: false
};

const createFormEditTemplate = (event) => {
  const {type, destination, price, description, startDateInsideTegFormEdit, endDateInsideTegFormEdit, offer} = event;
  const typesTemplate = createEventEditTypesTemplate(type);
  const offersTemplate = createEventOfferTemplate(offer);
  const isSubmitDisabled = price && (price > 0);
  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination} list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDateInsideTegFormEdit}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDateInsideTegFormEdit}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${price}>
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
        </section>
      </section>
    </form>
  </li>`;
};

export default class EventEditView extends SmartView {
  #event = null;

  constructor(event = BLANK_EVENT) {
    super();
    this._data = EventEditView.parseEventToData(event);


    this.#setInnerHandlers();
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
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value,
    }, true);
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

  static parseEventToData = (event) => ({...event,

  });

  static parseDataToEvent = (data) => {
    const event = {...data};

    return event;
  }
}

