import dayjs from 'dayjs';

const getInteger = (min = 0, max = 10) => {
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
  const hoursPerDay = getInteger(0, 24);
  const minutesPerHour = getInteger(0, 60);
  const secondsPerMinute = getInteger(0, 60);

  return dayjs().add(daysGap, 'day').add(hoursPerDay, 'hour').add(minutesPerHour, 'minute').add(secondsPerMinute, 'second').toDate();
};

const fullDate = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const yearMonthDate = (date) => dayjs(date).format('YYYY-MM-DD');
const humanizeDate = (date) => dayjs(date).format('MMM D');
const hoursMinutesDate = (date) => dayjs(date).format('hh:mm');
const slashFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export { getInteger, getRandomArrayElement, generateDate, humanizeDate, hoursMinutesDate, yearMonthDate, fullDate, slashFullDate };
