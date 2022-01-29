import dayjs from 'dayjs';

export const sortEventPrice = (eventA, eventB) => (eventB.price - eventA.price);

export const sortEventDay = (eventA, eventB) => (dayjs(eventA.startDate) - dayjs(eventB.startDate));

export const sortEventTime = (eventA, eventB) => {
  const timeEventA = dayjs(eventA.endDate).diff(dayjs(eventA.startDate));
  const timeEventB = dayjs(eventB.endDate).diff(dayjs(eventB.startDate));
  let time;
  return time ?? (dayjs(timeEventB).diff(dayjs(timeEventA)));
};

const getNumberWithZero = (number, units) => {
  let numberWithZero;
  if (number < 10) {
    numberWithZero = `${0 }${number  }${units}`;
  } else {
    numberWithZero = `${number  }${units}`;
  }
  return numberWithZero;
};

let resultTime;
let resultMinutes;
let resultHours;
let resultDays;
let remainMinutes;

export const generateTimeDifference = (startTime, endTime) => {
  const differenceTimeMinute = dayjs(endTime).diff(startTime, 'minute');
  switch(true) {
    case (differenceTimeMinute < 60):
      resultTime = getNumberWithZero(differenceTimeMinute, 'M');
      break;
    case (differenceTimeMinute < 1440):
      resultHours = parseInt(differenceTimeMinute/60, 10);
      resultMinutes = differenceTimeMinute - resultHours*60;
      resultTime = `${getNumberWithZero(resultHours, 'H')} ${getNumberWithZero(resultMinutes, 'M')}`;
      break;
    case (differenceTimeMinute >= 1440):
      resultDays = parseInt(differenceTimeMinute/1440, 10);
      remainMinutes = differenceTimeMinute-(resultDays*1440);
      resultHours = parseInt(remainMinutes/60, 10);
      resultMinutes = remainMinutes - resultHours*60;
      resultTime = `${getNumberWithZero(resultDays, 'D')} ${getNumberWithZero(resultHours, 'H')} ${getNumberWithZero(resultMinutes, 'M')}`;
      break; }
  return resultTime;
};

export const generateMinutesInAllTime = (minutes) => {

  switch(true) {
    case (minutes < 60):
      resultTime = getNumberWithZero(minutes, 'M');
      break;
    case (minutes < 1440):
      resultHours = parseInt(minutes/60, 10);
      resultMinutes = minutes- resultHours*60;
      resultTime = `${getNumberWithZero(resultHours, 'H')} ${getNumberWithZero(resultMinutes, 'M')}`;
      break;
    case (minutes >= 1440):
      resultDays = parseInt(minutes/1440, 10);
      remainMinutes = minutes-(resultDays*1440);
      resultHours = parseInt(remainMinutes/60, 10);
      resultMinutes = remainMinutes - resultHours*60;
      resultTime = `${getNumberWithZero(resultDays, 'D')} ${getNumberWithZero(resultHours, 'H')} ${getNumberWithZero(resultMinutes, 'M')}`;
      break; }
  return resultTime;
};

export const countEventsMoney = (events, type) => {
  const filteredEvents = events.filter((event) => event.type === type);
  return {
    totalMoney: filteredEvents.reduce((totalMoney, event) => totalMoney + event.price, 0),
    eventType: type,
  };
};

export const countEventsQuantityByType = (events, type) => {
  const filteredEvents = events.filter((event) => event.type === type);
  return {
    totalQuantity: filteredEvents.length,
    eventType: type,
  };
};

export const countEventsTimeByType = (events, type) => {
  const filteredEvents = events.filter((tripEvent) => tripEvent.type === type);
  return {
    totalTime: filteredEvents.reduce((totalTime, event) => totalTime + dayjs(event.endDate).diff(dayjs(event.startDate), 'minutes'), 0),
    eventType: type,
  };
};
