import dayjs from 'dayjs';
import {FilterType} from '../const';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);


export const isEventFuture = (startDate) => dayjs(startDate).isSameOrAfter(dayjs(), 'D');
export const isEventPast = (endDate) => dayjs(endDate).isBefore(dayjs(), 'D');
export const isEventEverywhere = (startDate, endDate) => dayjs(startDate).isBefore(dayjs(), 'D') && dayjs(endDate).isAfter(dayjs(), 'D');

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.endDate) || isEventEverywhere(event.startDate, event.endDate)),
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.startDate) || isEventEverywhere(event.startDate, event.endDate)),
};

