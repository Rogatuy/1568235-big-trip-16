import dayjs from 'dayjs';

export const sortEventPrice = (eventA, eventB) => (eventB.price - eventA.price);

export const sortEventTime = (eventA, eventB) => {
  const timeEventA = dayjs(eventA.endDateInsideTegEvent).diff(dayjs(eventA.startDateInsideTegEvent));
  const timeEventB = dayjs(eventB.endDateInsideTegEvent).diff(dayjs(eventB.startDateInsideTegEvent));
  let time;
  return time ?? (dayjs(timeEventB).diff(dayjs(timeEventA)));
};
