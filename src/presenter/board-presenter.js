import SortView from '../view/sort-view.js';
import EventListView from '../view/list-events-view.js';
import EventPresenter from './event-presenter.js';
import {render, RenderPosition} from '../utils/render.js';
import BoardView from '../view/board-view.js';
import NoEventView from '../view/no-event-view.js';
import {sortEventPrice, sortEventTime} from '../utils/event.js';
import {SortType, UpdateType, UserAction} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #eventsModel = null;

  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #noEventComponent = new NoEventView();
  #sortComponent = null;

  #eventPresenter = new Map();
  #currentSortType = SortType.DAY;

  constructor (boardContainer, eventsModel) {
    this.#boardContainer = boardContainer;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...this.#eventsModel.events].sort(sortEventPrice);
      case SortType.TIME:
        return [...this.#eventsModel.events].sort(sortEventTime);
    }
    return this.#eventsModel.events;
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#eventListComponent, RenderPosition.BEFOREEND);
    this.#renderBoard();
  }

  #handleModeChange = () => {
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

    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN )
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
    render(this.#eventListComponent, this.#noEventComponent, RenderPosition.BEFOREEND);
  }

  // #clearEvents = () => {
  //   this.#eventPresenter.forEach((presenter) => presenter.destroy());
  //   this.#eventPresenter.clear();
  // }

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noEventComponent);

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

