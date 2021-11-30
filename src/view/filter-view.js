import {generateFilters} from '../mock/filter.js';

const createFilterTemplate = (arrayOfFilters) => {
  const arrayOfFilter = arrayOfFilters;
  return arrayOfFilter.map((array) => `    <div class="trip-filters__filter">
  <input id="filter-${array.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${array.name}" checked>
  <label class="trip-filters__filter-label" for="filter-${array.name}">${array.name}</label>
</div>`).join('');
};

export const createFiltersTemplate = () => {
  const filters = createFilterTemplate(generateFilters());
  return `<form class="trip-filters" action="#" method="get">
  ${filters}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};
