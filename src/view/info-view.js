import {sortEventDay} from '../utils/event.js';
import AbstractView from './abstract-view.js';
import {CitiesCount} from '../const.js';
import dayjs from 'dayjs';

const createCitiesList = (events) => {
  const eventsCount = events.length;

  switch (eventsCount) {
    case CitiesCount.ONE_CITY:
      return `${events[0].destination.name}`;
    case CitiesCount.TWO_CITIES:
      return `${events[0].destination.name}&mdash;${events[1].destination.name}`;
    case CitiesCount.THREE_CITIES:
      return `${events[0].destination.name}&mdash;${events[1].destination.name}&mdash;${events[2].destination.name}`;
    default:
      return `${events[0].destination.name}&mdash;...&mdash;${events[events.length - 1].destination.name}`;
  }
};

const createTripInfoTemplate = (events) => {
  if (events.length === 0 || events === null) {
    return '';
  }

  const arrangedPoints = events.sort(sortEventDay);

  const totalPrice = arrangedPoints
    .reduce( (previousValue, item) =>  previousValue + item.price + item.offers
      .reduce( (sum, offer) => sum + offer.price, 0), 0);

  const tripStartDate = dayjs(arrangedPoints[0].startDate).format('DD MMM');
  const tripEndDate = dayjs(arrangedPoints[arrangedPoints.length - 1].endDate).format('DD MMM');

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${createCitiesList(events)}</h1>
    <p class="trip-info__dates">${tripStartDate}&nbsp;&mdash;&nbsp;${tripEndDate}</p>
  </div>
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
  </p>
</section>`;
};

export default class InfoView extends AbstractView {
  #events = null;

  constructor(events) {
    super();
    this.#events = events;
  }

  get template() {
    return createTripInfoTemplate(this.#events);
  }
}
