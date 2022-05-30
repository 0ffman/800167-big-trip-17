const TYPE_VALUES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];
const TITLE_VALUES = [
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city'
];
const NAME_VALUES = [
  'Amsterdam',
  'Madrid',
  'Lissabon',
  'Berlin',
  'Leipzig'
];
const DESCRIPTION_VALUES = [
  'Cras molestie et quam eu auctor.',
  'Etiam lectus sapien, venenatis fermentum arcu at, laoreet vehicula ex.',
  'Cras vestibulum leo tincidunt odio tincidunt, vitae vehicula.',
  'Pellentesque dui erat, semper ut urna vitae, commodo pulvinar justo.',
  'Aenean nec lorem non lacus molestie commodo.',
  'Pellentesque vestibulum mi interdum mauris rutrum tempus.'
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const SortType = {
  DEFAULT: 'default',
  TIME: 'time',
  PRICE: 'price',
};

export { TYPE_VALUES, TITLE_VALUES, NAME_VALUES, DESCRIPTION_VALUES, FilterType, SortType };
