import SiteMenuView from './view/menu-view.js';
import InfoView from './view/info-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import EventListView from './view/list-events-view.js';
import EventEditView from './view/form-edit-view.js';
import EventNewView from './view/form-new-view.js';
import EventView from './view/event-view.js';
import {render, RenderPosition, replace} from './utils/render.js';
import {generateEvent} from './mock/event.js';
import BoardView from './view/board-view.js';
import NoEventView from './view/no-event-view.js';

const TASK_COUNT = 20;

const events = Array.from({length: TASK_COUNT}, generateEvent);

const siteBodyElement = document.querySelector('.page-body');
const siteHeaderElement = siteBodyElement.querySelector('.page-header');
const siteHeaderFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteHeaderMenuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteHeaderInfoElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = siteBodyElement.querySelector('.page-main');
const siteEventsElement = siteMainElement.querySelector('.trip-events');


const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replaceEventToForm = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.setEditClickHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.setFormSubmitHandler( () => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventListElement, eventComponent, RenderPosition.BEFOREEND);
};

//
const renderBoard = (boardContainer, boardEvents) => {
  render(siteHeaderMenuElement, new SiteMenuView(), RenderPosition.BEFOREEND);
  render(siteHeaderInfoElement, new InfoView(), RenderPosition.AFTERBEGIN);
  render(siteHeaderFilterElement, new FilterView(), RenderPosition.BEFOREEND);

  const boardComponent = new BoardView();
  render(boardContainer, boardComponent, RenderPosition.BEFOREEND);

  const siteListEvents = new EventListView();
  render(boardComponent, siteListEvents, RenderPosition.BEFOREEND);
  render(siteListEvents, new EventNewView(events[0]), RenderPosition.BEFOREEND);

  if (boardEvents.length === 0) {
    render(siteListEvents, new NoEventView(), RenderPosition.BEFOREEND);
  } else {
    render(boardComponent, new SortView(), RenderPosition.AFTERBEGIN);
    for (let i = 0; i < TASK_COUNT; i++) {
      renderEvent(siteListEvents.element, events[i]);
    }
  }
};

renderBoard(siteEventsElement,events);


