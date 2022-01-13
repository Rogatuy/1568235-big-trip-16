import dayjs from 'dayjs';

export const sortEventPrice = (eventA, eventB) => (eventB.price - eventA.price);

export const sortEventTime = (eventA, eventB) => {
  const timeEventA = dayjs(eventA.endDate).diff(dayjs(eventA.startDate));
  const timeEventB = dayjs(eventB.endDate).diff(dayjs(eventB.startDate));
  let time;
  return time ?? (dayjs(timeEventB).diff(dayjs(timeEventA)));
};

export const generateTimeDifference = (startTime, endTime) => {
  let resultTime;
  let resultMinutes;
  let resultHours;
  let resultDays;
  let remainMinutes;
  const getNumberWithZero = (number, units) => {
    let numberWithZero;
    if (number < 10) {
      numberWithZero = `${0 }${number  }${units}`;
    } else {
      numberWithZero = `${number  }${units}`;
    }
    return numberWithZero;
  };

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

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export const isEventFuture = (startDate) => dayjs(startDate).isSame(dayjs(), 'D') || dayjs(startDate).isAfter(dayjs(), 'D');
export const isEventPast = (endDate) => dayjs(endDate).isBefore(dayjs(), 'D');
export const isEventEverywhere = (startDate, endDate) => dayjs(startDate).isBefore(dayjs(), 'D') && dayjs(endDate).isAfter(dayjs(), 'D');
