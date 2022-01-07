import dayjs from 'dayjs';

export const sortEventPrice = (eventA, eventB) => (eventB.price - eventA.price);

export const sortEventTime = (eventA, eventB) => {
  const timeEventA = dayjs(eventA.endDateInsideTegEvent).diff(dayjs(eventA.startDateInsideTegEvent));
  const timeEventB = dayjs(eventB.endDateInsideTegEvent).diff(dayjs(eventB.startDateInsideTegEvent));
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
