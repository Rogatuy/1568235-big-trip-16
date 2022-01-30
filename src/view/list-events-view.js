import AbstractView from './abstract-view.js';

const createListEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListEventsView extends AbstractView {
  get template() {
    return createListEventsTemplate();
  }
}
