import SiteMenuView from './view/menu-view.js';
import InfoView from './view/info-view.js';

import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';

import {render, RenderPosition} from './utils/render.js';
import {generateEvent} from './mock/event.js';

const EVENT_COUNT = 8;

const events = Array.from({length: EVENT_COUNT}, generateEvent);
// const filters = [
//   {
//     type: 'everything',
//   },
// ];

const eventsModel = new EventsModel();
eventsModel.events = events;

const filterModel = new FilterModel();

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.page-header');
const siteHeaderFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteHeaderMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteHeaderInfoElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.page-main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');

// const boardPresenter = new BoardPresenter(siteEventsElement, eventsModel);

render(siteHeaderMenuElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteHeaderInfoElement, new InfoView(), RenderPosition.AFTERBEGIN);
// render(siteHeaderFilterElement, new FilterView(filters, 'everything'), RenderPosition.BEFOREEND);

// const boardPresenter = new BoardPresenter(siteMainElement, eventsModel);
const boardPresenter = new BoardPresenter(siteMainElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, eventsModel);

filterPresenter.init();
boardPresenter.init();


