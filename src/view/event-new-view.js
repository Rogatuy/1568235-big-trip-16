import AbstractView from './abstract-view.js';
import dayjs from 'dayjs';
import {createEventEditTypesTemplate} from './event-edit-view.js';

export const BLANK_EVENT = {
  startDate: new Date(),
  endDate: new Date(),
  type: 'flight',
  offers:
  {
    type: 'flight',
    offer: [{
      title: 'Add luggage',
      price: 30,
    },
    {
      title: 'Switch to business',
      price: 150,
    }]
  },
  destination: {
    name: 'Bruxelles',
    description: 'Cras aliquet varius magna, non porta ligula feugiat eget.',
    photos: ['http://picsum.photos/248/152?r=2'],
  },
  price: 500,
  isFavorite: false
};

const createEventOffersTemplate = (offers) => {
  if (!offers) {
    return '';
  }

  const {offer} = offers;
  const eventOffers = offer.map(({title, price}) => (
    `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage">
          <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`)
  ).join('');
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${eventOffers}
    </div>
    </section>`;
};

const createEventPhotosTemplate = (destination) => {
  if (!destination.pictures) {
    return '';
  }

  const photos = destination.pictures.map((item) => (
    `<img class="event__photo" src="${item.src}" alt="${item.description}">)`
  )).join('');

  return `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${photos}
  </div>
  </div>`;
};

const createNewEventTemplate = (event = {}) => {
  const {type, destination, price, startDate, endDate, offers} = event;
  const {name, description} = destination;
  const eventPhotos = createEventPhotosTemplate(destination);
  const typesTemplate = createEventEditTypesTemplate(type);
  const offersTemplate = createEventOffersTemplate(offers);
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

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? '' : 'disabled'}></button>
        <button class="event__reset-btn" type="reset"}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
          ${offersTemplate}
          <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
         ${eventPhotos}
        </section>
      </section>
    </form>
  </li>`;
};

export default class NewEventView extends AbstractView {
  #event = null;

  constructor(event = BLANK_EVENT) {
    super();
    this.#event = event;
  }

  get template() {
    return createNewEventTemplate(this.#event);
  }
}
