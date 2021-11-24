import {createMenuTemplate} from './view/menu-view.js';
import {createInfoTemplate} from './view/info-view.js';
import {createFilterTemplate} from './view/filter-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createListEventsTemplate} from './view/list-events-view.js';
import {createFormEditTemplate} from './view/form-edit-view.js';
import {createFormNewEventTemplate} from './view/form-new-event.js';
import {createEventTemplate} from './view/event-view.js';
import {renderTemplate, RenderPosition} from './render.js';

const TASK_COUNT = 3;

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.page-header');
const siteHeaderFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteHeaderMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteHeaderInfoElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.page-main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');

renderTemplate(siteHeaderMenuElement, createMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteHeaderInfoElement, createInfoTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteHeaderFilterElement, createFilterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteEventsElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteEventsElement, createListEventsTemplate(), RenderPosition.BEFOREEND);

const siteListEvents = siteMainElement.querySelector('.trip-events__list');
renderTemplate(siteListEvents, createFormEditTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteListEvents, createFormNewEventTemplate(), RenderPosition.BEFOREEND);

for (let i = 0; i < TASK_COUNT; i++) {
  renderTemplate(siteListEvents, createEventTemplate(), RenderPosition.BEFOREEND);
}


