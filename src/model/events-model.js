import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const.js';

export default class EventsModel extends AbstractObservable {
  #apiService = null;
  #events= [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get events() {
    return this.#events;
  }

  init = async () => {
    try {
      const events = await this.#apiService.points;
      this.#events = events.map(this.#adaptToClient);
    } catch(err) {
      this.#events = [];
    }
    this._notify(UpdateType.INIT);
  }

  updateEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index < 0 ) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedEvent = this.#adaptToClient(response);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  addEvent = async (updateType, update) => {
    // try {
    const response = await this.#apiService.addEvent(update);
    const newEvent = this.#adaptToClient(response);
    this.#events = [newEvent, ...this.#events];
    this._notify(updateType, newEvent);
    // } catch(err) {
    //   throw new Error('Can\'t add task');
    // }
  }

  deleteEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      // Обратите внимание, метод удаления задачи на сервере
      // ничего не возвращает. Это и верно,
      // ведь что можно вернуть при удалении задачи?
      await this.#apiService.deleteEvent(update);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  };

  #adaptToClient = (point) => {
    const adaptedEvent = {...point,
      startDate: point['date_from'],
      endDate: point['date_to'],
      price: point['base_price'],
      isFavorite: point['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['base_price'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
