import dayjs from 'dayjs';
import { FilterType } from './data';

const MAX_VALUE = 10;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

const getInteger = (min = 0, max = MAX_VALUE) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  if ( min < 0 || min >= max ) {
    throw new Error(`Значение min: ${min} превышает значение max: ${max} или указано отрицательное число`);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayElement = (elements) => elements[getInteger(0, elements.length - 1)];


const generateDate = (dayStart, dayEnd) => {
  const daysGap = getInteger(dayStart, dayEnd);
  const hoursPerDay = getInteger(0, HOURS_IN_DAY);
  const minutesPerHour = getInteger(0, MINUTES_IN_HOUR);
  const secondsPerMinute = getInteger(0, MINUTES_IN_HOUR);

  return dayjs().add(daysGap, 'day').add(hoursPerDay, 'hour').add(minutesPerHour, 'minute').add(secondsPerMinute, 'second').toDate();
};

const getFullDate = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const getYearMonthDate = (date) => dayjs(date).format('YYYY-MM-DD');
const humanizeDate = (date) => dayjs(date).format('MMM D');
const getHoursMinutesDate = (date) => dayjs(date).format('hh:mm');
const getSlashFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const isDateFuture = (dateFrom) => dateFrom && dayjs().isBefore(dateFrom, 'D');
const isDatePast = (dateTo) => dateTo && dayjs().isAfter(dateTo, 'D');

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isDatePast(point.dateTo)),
};


const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }),
);

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {
  getInteger,
  getRandomArrayElement,
  generateDate,
  humanizeDate,
  getHoursMinutesDate,
  getYearMonthDate,
  getFullDate,
  getSlashFullDate,
  generateFilter,
  updateItem
};
