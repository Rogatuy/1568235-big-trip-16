import SiteMenuView from './view/menu-view.js';
import InfoView from './view/info-view.js';
import FilterView from './view/filter-view.js';
import {render, RenderPosition} from './utils/render.js';
import {generateEvent} from './mock/event.js';
import BoardPresenter from './presenter/board-presenter.js';

const TASK_COUNT = 8;

const events = Array.from({length: TASK_COUNT}, generateEvent);

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.page-header');
const siteHeaderFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteHeaderMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteHeaderInfoElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.page-main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter(siteEventsElement);

render(siteHeaderMenuElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteHeaderInfoElement, new InfoView(), RenderPosition.AFTERBEGIN);
render(siteHeaderFilterElement, new FilterView(), RenderPosition.BEFOREEND);

boardPresenter.init(events);


