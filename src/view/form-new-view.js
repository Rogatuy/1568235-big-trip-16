import {createEventEditTypesTemplate} from './form-edit-view.js';
import AbstractView from './abstract-view.js';
import {BLANK_EVENT} from './form-edit-view.js';
import dayjs from 'dayjs';

const createEventNewPhotosTemplate = (arrayOfPictures) => {
  const arrayOfPicture = arrayOfPictures;
  return arrayOfPicture.map((array) => `<img class="event__photo" src="${array.src}" alt="${array.description}">`).join('');
};

export const createEventOfferTemplate = (objectOfOffer) => {
  const arrayOffers = objectOfOffer.offers;
  return arrayOffers.map((array) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-"${array.titleForTeg}"-1" type="checkbox" name="event-offer-${array.titleForTeg}">
  <label class="event__offer-label" for="event-offer-${array.titleForTeg}-1">
    <span class="event__offer-title">${array.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${array.price}</span>
  </label>
</div>` ).join('');
};

const createFormNewEventTemplate = (event) => {
  const {type, price, destination, description, pictures, offer} = event;
  const typesTemplate = createEventEditTypesTemplate(type);
  const photosTemplate = createEventNewPhotosTemplate(pictures);
  const offersTemplate = createEventOfferTemplate(offer);
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
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs().format('DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs().format('DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${price}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
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

export default class EventNewView extends AbstractView{
  #event = null;

  constructor(event = BLANK_EVENT) {
    super();
    this.#event = event;
  }

  get template() {
    return createFormNewEventTemplate(this.#event);
  }
}
