import {getInteger, getRandomArrayElement, generateDate} from './utils.js';
import {TYPE_VALUES, TITLE_VALUES, NAME_VALUES, DESCRIPTION_VALUES} from './data.js';

const RANDOM_PHOTO_COUNT = 50;
const MAX_ID = 20;
const MIN_BASE_PRICE = 100;
const MAX_BASE_PRICE = 300;
const MAX_PRICE = 500;
const MAX_DATE_FROM = 2;
const MIN_DATE_TO = 5;
const MAX_DATE_TO = 10;
const OFFERS_COUNT = 3;


const generateDestination = () => ({
  description: getRandomArrayElement(DESCRIPTION_VALUES),
  name: getRandomArrayElement(NAME_VALUES),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getInteger(0, RANDOM_PHOTO_COUNT)}`,
      description: getRandomArrayElement(DESCRIPTION_VALUES)
    },
    {
      src: `http://picsum.photos/248/152?r=${getInteger(0, RANDOM_PHOTO_COUNT)}`,
      description: getRandomArrayElement(DESCRIPTION_VALUES)
    },
    {
      src: `http://picsum.photos/248/152?r=${getInteger(0, RANDOM_PHOTO_COUNT)}`,
      description: getRandomArrayElement(DESCRIPTION_VALUES)
    }
  ]
});


const generateOffer = () => ({
  type: getRandomArrayElement(TYPE_VALUES),
  offers: [
    {
      id: 1,
      title: getRandomArrayElement(TITLE_VALUES),
      price: getInteger(0, MAX_PRICE)
    },
    {
      id: 2,
      title: getRandomArrayElement(TITLE_VALUES),
      price: getInteger(0, MAX_PRICE)
    },
    {
      id: 3,
      title: getRandomArrayElement(TITLE_VALUES),
      price: getInteger(0, MAX_PRICE)
    }
  ]
});

const generatePoint = () => ({
  id: getInteger(1, MAX_ID),
  basePrice: getInteger(MIN_BASE_PRICE, MAX_BASE_PRICE),
  dateFrom: generateDate(0, MAX_DATE_FROM),
  dateTo: generateDate(MIN_DATE_TO, MAX_DATE_TO),
  destination: generateDestination(),
  isFavorite: Boolean(getInteger(0, 1)),
  offers: getRandomArrayElement(Array.from({length: OFFERS_COUNT}, generateOffer)).offers,
  type: getRandomArrayElement(TYPE_VALUES)
});

export { generatePoint };
