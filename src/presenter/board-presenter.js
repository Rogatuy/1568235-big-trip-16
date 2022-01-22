import SortView from '../view/sort-view.js';
import EventListView from '../view/list-events-view.js';
import BoardView from '../view/board-view.js';
import NoEventView from '../view/no-event-view.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {sortEventPrice, sortEventTime} from '../utils/event.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

import EventPresenter from './event-presenter.js';
import EventNewPresenter from './event-new-presenter.js';


export default class BoardPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #noEventComponent = null;
  #sortComponent = null;

  #eventPresenter = new Map();
  #eventNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor (boardContainer, eventsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventNewPresenter = new EventNewPresenter(this.#eventListComponent, this.#handleViewAction); //может быть не сюда, надо посмотреть

  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredEvents.sort(sortEventPrice);
      case SortType.TIME:
        return filteredEvents.sort(sortEventTime);
    }

    return filteredEvents;
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#eventListComponent, RenderPosition.BEFOREEND);

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetSortType: true});

    remove(this.#eventListComponent);
    remove(this.#boardComponent);

    this.#eventsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  createEvent = () => {
    this.#eventNewPresenter.init();
  }

  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventListComponent, this.#handleViewAction, this.#handleModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #renderEvents = (events) => {
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderNoEvents = () => {
    this.#noEventComponent = new NoEventView(this.#filterType);
    render(this.#eventListComponent, this.#noEventComponent, RenderPosition.BEFOREEND);
  }

  #clearBoard = (resetSortType = false) => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

  }

  #renderBoard = () => {
    const events = this.events;
    if (events.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      this.#renderEvents(events);
    }
  }
}

