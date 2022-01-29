import MenuView from './view/menu-view.js';
import StatisticsView from './view/statistics-view.js';

import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';

import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, AUTHORIZATION, END_POINT} from './const.js';
import ApiService from './api-service.js';

const eventsModel = new EventsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const siteBodyElement = document.querySelector('.page-body');
export const siteHeaderElement = siteBodyElement.querySelector('.page-header');
const siteHeaderFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteHeaderMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteHeaderInfoElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.page-main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');
const siteMenuComponent = new MenuView();


const boardPresenter = new BoardPresenter(siteEventsElement, eventsModel, filterModel, siteHeaderInfoElement);
const filterPresenter = new FilterPresenter(siteHeaderFilterElement, filterModel, eventsModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch(menuItem.textContent) {
    case MenuItem.TABLE:
      boardPresenter.init();
      filterPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      boardPresenter.destroy();
      filterPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.events);
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createEvent();
  document.querySelector('.trip-main__event-add-btn').disabled = true;
});


boardPresenter.init();

eventsModel.init().finally(() => {
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  filterPresenter.init();
  render(siteHeaderMenuElement, siteMenuComponent, RenderPosition.BEFOREEND);
});

