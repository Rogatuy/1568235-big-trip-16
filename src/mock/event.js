import { getRandomInt, getFirstWordOfString, getRandomElementsArray,generateRandomElementOfArray } from '../utils/common';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

export const TYPE_OF_POINT = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];
const CITY = ['Barcelona', 'Paris', 'Mardid'];
const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const OFFER_DESCRIPTION = [
  'Descriptio 1',
  'Descripti 2',
  'Descript 3'
];

const MAX_DAY_GAP = 3;
const MAX_HOURS_GAP = 12;
const MAX_MINUTES_GAP = 60;

const generateDescription = () => {
  const numberOfDescription = getRandomInt(1, 5);
  const arrayOfDescription = getRandomElementsArray(DESCRIPTION, numberOfDescription);
  const lineOfDescription = arrayOfDescription.join(' ');
  return lineOfDescription;
};

const generateDate = () => {
  const daysGap = getRandomInt(-MAX_DAY_GAP, MAX_DAY_GAP);
  const hoursGap = getRandomInt(0, MAX_HOURS_GAP);
  const minutesGap = getRandomInt(0, MAX_MINUTES_GAP);
  return dayjs().add(daysGap, 'day').add(hoursGap, 'hours').add(minutesGap, 'minutes').toDate();

};

const generateDateEnd = (startDate) => {
  const daysGap = getRandomInt(0, MAX_DAY_GAP);
  const hoursGap = getRandomInt(0, MAX_HOURS_GAP);
  const minutesGap = getRandomInt(0, MAX_MINUTES_GAP);
  return dayjs(startDate).add(daysGap, 'day').add(hoursGap, 'hours').add(minutesGap, 'minutes');
};

const generateTimeDifference = (startTime, endTime) => {
  let resultTime;
  let resultMinutes;
  let resultHours;
  let resultDays;
  let remainMinutes;
  const differenceTimeMinute = dayjs(endTime).diff(startTime, 'minute');
  switch(true) {
    case (differenceTimeMinute < 60):
      resultTime = `${differenceTimeMinute  }M`;
      break;
    case (differenceTimeMinute < 1440):
      resultHours = parseInt(differenceTimeMinute/60, 10);
      resultMinutes = differenceTimeMinute - resultHours*60;
      resultTime = (resultMinutes !== 0) ? (`${resultHours}H ${resultMinutes}M`) : (`${resultHours}H`);
      break;
    case (differenceTimeMinute >= 1440):
      resultDays = parseInt(differenceTimeMinute/1440, 10);
      remainMinutes = differenceTimeMinute-(resultDays*1440);
      resultHours = parseInt(remainMinutes/60, 10);
      resultMinutes = remainMinutes - resultHours*60;
      if ((resultMinutes !== 0) && (resultHours !== 0)) {
        resultTime = `${resultDays  }D ${resultHours}H ${resultMinutes}M`;
      } else {
        if (resultHours === 0) {
          resultTime = `${resultDays  }D ${resultMinutes}M`;
        } else {
          resultTime = `${resultDays  }D ${resultHours}H`;
        }
        break; }
  }
  return resultTime;
};

const generatePhotos = () => {
  const quantityPhotos = getRandomInt(1, 5);
  const arrayOfPictures = [];
  for (let i = 0; i < quantityPhotos; i++)  {
    const randomPhoto = Math.random();
    arrayOfPictures[i] = {
      src: `http://picsum.photos/300/200?r=${randomPhoto}`,
      description: `Description ${i+1}`,
    };
  }
  return arrayOfPictures;
};

const generateObjectOffer = () => {
  const numberOfferDescription = getRandomInt(0, 2);
  const offerDescription = OFFER_DESCRIPTION[numberOfferDescription];
  const firstWordOfTitle = getFirstWordOfString(offerDescription);
  const offerPrice = getRandomInt(1, 200);
  const offerObject = { title: offerDescription,
    titleForTeg: firstWordOfTitle,
    price: offerPrice
  };
  return offerObject;
};


const generateOfferEvent = (typeOfEvent) => {
  const quantityOfOffers = getRandomInt(1, 4);
  const arrayOfOffers = (numberOfOffers) => {
    const arrayOffers = [];
    for (let i = 0; i < numberOfOffers; i++) {
      arrayOffers[i] =  generateObjectOffer();
    }
    return arrayOffers;
  };
  const objectOffersEvent = {
    type: typeOfEvent,
    offers: arrayOfOffers(quantityOfOffers)
  };
  return objectOffersEvent;
};

export const generateEvent = () => {
  const startDate = generateDate();
  const dueDate = dayjs().format('DD/MM/YY HH:mm');
  const startDateOutsideTegEvent = dayjs(startDate).format('HH:mm');
  const startDateInsideTegEvent = dayjs(startDate).format('YYYY-MM-DDTHH:mm');
  const startDateInsideTegFormEdit = dayjs(startDate).format('DD/MM/YY HH:mm');
  const endDate = generateDateEnd(startDate);
  const endDateOutsideTegEvent = dayjs(endDate).format('HH:mm');
  const endDateInsideTegEvent = dayjs(endDate).format('YYYY-MM-DDTHH:mm');
  const endDateInsideTegFormEdit = dayjs(endDate).format('DD/MM/YY HH:mm');
  const dateDayOutsideTegEvent = dayjs(startDate).format('MMM DD');
  const dateDayInsideTegEvent = dayjs(startDate).format('DD-MM-YYYY');
  const timeDifference = generateTimeDifference(startDate, endDate);
  const pictures = generatePhotos();
  const type = generateRandomElementOfArray(TYPE_OF_POINT);
  return {
    id: nanoid(),
    startDate,
    endDate,
    dueDate,
    dateDayOutsideTegEvent,
    dateDayInsideTegEvent,
    startDateOutsideTegEvent,
    startDateInsideTegEvent,
    startDateInsideTegFormEdit,
    endDateOutsideTegEvent,
    endDateInsideTegEvent,
    endDateInsideTegFormEdit,
    timeDifference,
    pictures,
    type: type,
    offer: generateOfferEvent(type),
    destination: generateRandomElementOfArray(CITY),
    description: generateDescription(),
    price: getRandomInt(0, 100),
    isFavorite: Boolean(getRandomInt(0, 1)),
  };
};

