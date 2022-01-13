import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const NoEventsTextType = {
  [FilterType.EVERYTHING]: 'Click «ADD NEW EVENT» in menu to create your first event',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createNoEventTemplate = (filterType) => {
  const noEventTextValue = NoEventsTextType[filterType];

  return (
    `<p class="trip-events__msg">
    ${noEventTextValue}
  </p>`
  );
};

export default class NoEventView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoEventTemplate(this._data);
  }
}
