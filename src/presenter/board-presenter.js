import SortView from '../view/sort-view.js';
import EventListView from '../view/list-events-view.js';
import BoardView from '../view/board-view.js';
import NoEventView from '../view/no-event-view.js';
import LoadingView from '../view/loading-view.js';

import {render, remove, RenderPosition} from '../utils/render.js';
import {sortEventDay, sortEventPrice, sortEventTime} from '../utils/event.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

import EventPresenter, {State as EventPresenterViewState} from './event-presenter.js';
import EventNewPresenter from './event-new-presenter.js';


export default class BoardPresenter {
  #boardContainer = null;
  #eventsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();
  #loadingComponent = new LoadingView();
  #noEventComponent = null;
  #sortComponent = null;

  #eventPresenter = new Map();
  #eventNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

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
      case SortType.DAY:
        return filteredEvents.sort(sortEventDay);
      case SortType.PRICE:
        return filteredEvents.sort(sortEventPrice);
      case SortType.TIME:
        return filteredEvents.sort(sortEventTime);
    }

    return filteredEvents;
  }

  get offers() {
    return this.#eventsModel.offers;
  }

  get destinations() {
    return this.#eventsModel.destinations;
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
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#eventNewPresenter.init(this.#eventsModel.destinations, this.#eventsModel.offers);
  }

  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenter.get(update.id).setViewState(EventPresenterViewState.SAVING);
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenter.get(update.id).setViewState(EventPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_EVENT:
        this.#eventNewPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#eventNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenter.get(update.id).setViewState(EventPresenterViewState.DELETING);
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenter.get(update.id).setViewState(EventPresenterViewState.ABORTING);
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventListComponent, this.#handleViewAction, this.#handleModeChange);
    eventPresenter.init(event, this.#eventsModel.offers, this.#eventsModel.destinations);
    this.#eventPresenter.set(event.id, eventPresenter);
  }

  #renderEvents = (events) => {
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderLoading = () => {
    render(this.#boardComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
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
    remove(this.#loadingComponent);

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const events = this.events;
    if (events.length === 0) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      this.#renderEvents(events);
    }
  }
}

