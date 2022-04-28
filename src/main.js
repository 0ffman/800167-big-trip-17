import {render} from './render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/event-presenter.js';

const siteMainElement = document.querySelector('.page-main');
const siteEventContainerElement = siteMainElement.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.page-header');
const filterContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter();

render(new FilterView(), filterContainerElement);

tripPresenter.init(siteEventContainerElement);
