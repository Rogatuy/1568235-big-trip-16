import { isEventEverywhere, isEventFuture, isEventPast } from '../utils/event.js';
import {FilterType} from '../const';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((task) => task),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.endDate) && isEventEverywhere(event.startDate, event.endDate)),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.startDate) && isEventEverywhere(event.startDate, event.endDate)),
};
