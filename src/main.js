import SiteMenuView from './view/menu-view.js';
import InfoView from './view/info-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import EventListView from './view/list-events-view.js';
import EventEditView from './view/form-edit-view.js';
import EventNewView from './view/form-new-view.js';
import EventView from './view/event-view.js';
import {renderElement, RenderPosition} from './render.js';
import {generateEvent} from './mock/event.js';
import BoardView from './view/board-view.js';

const TASK_COUNT = 12;

const events = Array.from({length: TASK_COUNT}, generateEvent);

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.page-header');
const siteHeaderFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteHeaderMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteHeaderInfoElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.page-main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');
const boardComponent = new BoardView();

renderElement(siteHeaderMenuElement, new SiteMenuView().element, RenderPosition.BEFOREEND);
renderElement(siteHeaderInfoElement, new InfoView().element, RenderPosition.AFTERBEGIN);
renderElement(siteHeaderFilterElement, new FilterView().element, RenderPosition.BEFOREEND);
renderElement(siteEventsElement, boardComponent.element, RenderPosition.BEFOREEND);
renderElement(boardComponent.element, new SortView().element, RenderPosition.AFTERBEGIN);

const siteListEvents = new EventListView();
renderElement(boardComponent.element, siteListEvents.element, RenderPosition.BEFOREEND);
renderElement(siteListEvents.element, new EventEditView(events[0]), RenderPosition.BEFOREEND);
renderElement(siteListEvents.element, new EventNewView(events[1]), RenderPosition.BEFOREEND);

for (let i = 2; i < TASK_COUNT; i++) {
  renderElement(siteListEvents.element, new EventView(events[i]), RenderPosition.BEFOREEND);
}


