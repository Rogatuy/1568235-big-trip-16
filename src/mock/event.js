import { getRandomInt, getFirstWordOfString, getRandomElementsArray,generateRandomElementOfArray } from '../util';
import dayjs from 'dayjs';

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
  const differenceTimeMinute = dayjs(endTime).diff(startTime, 'minute');
  if (differenceTimeMinute < 60) {
    const resultMinutes = `${differenceTimeMinute  }M`;
    const resultTime = resultMinutes;
    return resultTime;
  } else {
    if (differenceTimeMinute < 1440) {
      const resultHours = parseInt(differenceTimeMinute/60, 10);
      const resultMinutes = differenceTimeMinute - resultHours*60;
      let resultTime;
      if (resultMinutes !== 0) {
        resultTime = `${resultHours}H ${resultMinutes}M`;
      } else {
        resultTime = `${resultHours}H`;
      }
      return resultTime;
    } else {
      const resultDays = parseInt(differenceTimeMinute/1440, 10);
      const remainMinutes = differenceTimeMinute-(resultDays*1440);
      const resultHours = parseInt(remainMinutes/60, 10);
      const resultMinutes = remainMinutes - resultHours*60;
      let resultTime;
      if ((resultMinutes !== 0) && (resultHours !== 0)) {
        resultTime = `${resultDays  }D ${resultHours}H ${resultMinutes}M`;
      } else {
        if (resultHours === 0) {
          resultTime = `${resultDays  }D ${resultMinutes}M`;
        } else {
          resultTime = `${resultDays  }D ${resultHours}H`;
        }
      }
      return resultTime;
    }
  }
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
    price: getRandomInt(0, 1000),
    isFavorite: Boolean(getRandomInt(0, 1)),
  };
};

