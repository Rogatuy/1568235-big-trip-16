import SortView from '../view/sort-view.js';
import EventListView from '../view/list-events-view.js';
import EventPresenter from './event-presenter.js';
import {render, RenderPosition} from '../utils/render.js';
import BoardView from '../view/board-view.js';
import NoEventView from '../view/no-event-view.js';
import {updateItem} from '../utils/common.js';
import {sortEventPrice, sortEventTime} from '../utils/event.js';
import {SortType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;

  #boardComponent = new BoardView();
  #sortComponent = new SortView();
  #eventListComponent = new EventListView();
  #noEventComponent = new NoEventView();

  #boardEvents = [];
  #eventPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardEvents = [];

  constructor (boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardEvents) => {
    this.#boardEvents = [...boardEvents];
    this.#sourcedBoardEvents = [...boardEvents];
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#eventListComponent, RenderPosition.BEFOREEND);
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleEventChange = (updatedEvent) => {
    this.#boardEvents = updateItem(this.#boardEvents, updatedEvent);
    this.#sourcedBoardEvents = updateItem(this.#sourcedBoardEvents, updatedEvent);
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent);
  }

  #sortEvents = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#boardEvents.sort(sortEventPrice);
        break;
      case SortType.TIME:
        this.#boardEvents.sort(sortEventTime);
        break;
      case SortType.DAY:
        this.#boardEvents = [...this.#sourcedBoardEvents];
        break;
      default:
        this.#boardEvents = [...this.#sourcedBoardEvents];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);
    this.#clearEvents();
    this.#renderEvents();
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventListComponent, this.#handleEventChange, this.#handleModeChange);
    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #renderEvents = () => {
    this.#boardEvents.forEach((event) => this.#renderEvent(event));
  }

  #renderNoEvents = () => {
    render(this.#eventListComponent, this.#noEventComponent, RenderPosition.BEFOREEND);
  }

  #clearEvents = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
  }

  #renderBoard = () => {
    if (this.#boardEvents.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      this.#renderEvents();
    }
  }
}

