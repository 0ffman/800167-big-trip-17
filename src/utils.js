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

const getEventDates = (dateFrom, dateTo) => {
  let dateFromFormat = '';
  let dateToFormat = '';
  if ( dateFrom !== null && dateTo !== null ) {
    const dateFromMonth = dayjs(dateFrom).format('M');
    const dateToMonth = dayjs(dateTo).format('M');
    if ( dateFromMonth !== dateToMonth ) {
      dateFromFormat = dayjs(dateFrom).format('D MMM');
      dateToFormat = dayjs(dateTo).format('D MMM');
    } else {
      dateFromFormat = dayjs(dateFrom).format('D MMM');
      dateToFormat = dayjs(dateTo).format('D');
    }
  }
  return `${dateFromFormat}&nbsp;&mdash;&nbsp;${dateToFormat}`;
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isDatePast(point.dateTo)),
};

const sortEventTime = (eventA, eventB) => {
  const dateFromOne = dayjs(eventA.dateFrom);
  const dateToOne = dayjs(eventA.dateTo);
  const durationEventOne = dateToOne.diff(dateFromOne);

  const dateFromTwo = dayjs(eventB.dateFrom);
  const dateToTwo = dayjs(eventB.dateTo);
  const durationEventTwo = dateToTwo.diff(dateFromTwo);

  return durationEventTwo - durationEventOne;
};

const sortEventPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const sortEventDay = (eventA, eventB) => {
  const dateFromOne = dayjs(eventA.dateFrom);
  const dateFromTwo = dayjs(eventB.dateFrom);
  return dateFromOne.diff(dateFromTwo);
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const getEventOffersType = (offers, type) => offers.find((offer) => offer.type === type)
  ? offers.find((offer) => offer.type === type).offers
  : [];

export {
  getInteger,
  getRandomArrayElement,
  generateDate,
  humanizeDate,
  getHoursMinutesDate,
  getYearMonthDate,
  getFullDate,
  getSlashFullDate,
  sortEventTime,
  sortEventPrice,
  sortEventDay,
  isDatesEqual,
  filter,
  getEventDates,
  getEventOffersType
};
