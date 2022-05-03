import { getInteger, getRandomArrayElement, generateDate } from './utils.js';
import { TYPE_VALUES, TITLE_VALUES, NAME_VALUES, DESCRIPTION_VALUES } from './data.js';


const generateDestination = () => ({
  description: getRandomArrayElement(DESCRIPTION_VALUES),
  name: getRandomArrayElement(NAME_VALUES),
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${getInteger(0, 50)}`,
      description: getRandomArrayElement(DESCRIPTION_VALUES)
    },
    {
      src: `http://picsum.photos/248/152?r=${getInteger(0, 50)}`,
      description: getRandomArrayElement(DESCRIPTION_VALUES)
    },
    {
      src: `http://picsum.photos/248/152?r=${getInteger(0, 50)}`,
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
      price: getInteger(0, 500)
    },
    {
      id: 2,
      title: getRandomArrayElement(TITLE_VALUES),
      price: getInteger(0, 500)
    },
    {
      id: 3,
      title: getRandomArrayElement(TITLE_VALUES),
      price: getInteger(0, 500)
    }
  ]
});

const generatePoint = () => ({
  id: getInteger(1, 20),
  basePrice: getInteger(100, 300),
  dateFrom: generateDate(0, 2),
  dateTo: generateDate(5, 10),
  destination: getRandomArrayElement(Array.from({length: 10}, generateDestination)),
  isFavorite: Boolean(getInteger(0, 1)),
  offers: getRandomArrayElement(Array.from({length: 20}, generateOffer)).offers,
  type: getRandomArrayElement(TYPE_VALUES)
});

export { generatePoint };
