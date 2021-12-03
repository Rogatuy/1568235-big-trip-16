import {createElement} from '../render.js';

const FILTERS = [{
  name: 'everything',
}, {
  name: 'past',
}, {
  name: 'future',
}];

const createFilterTemplate = (arrayOfFilters) => {
  const arrayOfFilter = arrayOfFilters;
  return arrayOfFilter.map((array) => `    <div class="trip-filters__filter">
  <input id="filter-${array.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${array.name}" checked>
  <label class="trip-filters__filter-label" for="filter-${array.name}">${array.name}</label>
</div>`).join('');
};

const createFiltersTemplate = () => {
  const filters = createFilterTemplate(FILTERS);
  return `<form class="trip-filters" action="#" method="get">
  ${filters}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FilterView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFiltersTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
