import dayjs from 'dayjs';

export const sortEventPrice = (eventA, eventB) => {
  if (eventA.price > eventB.price) {
    return Math.abs(eventA.price - eventB.price);
  }
};

export const sortEventTime = (eventA, eventB) => {
  const timeEventA = dayjs(eventA.endDate).diff(dayjs(eventA.startDate));
  const timeEventB = dayjs(eventB.endDate).diff(dayjs(eventB.startDate));
  let time;
  return time ?? (dayjs(timeEventB).diff(dayjs(timeEventA)));
};
