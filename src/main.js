import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/event-presenter.js';
import PointsModel from './model/points-model.js';
import { generateFilter } from './utils.js';

const siteMainElement = document.querySelector('.page-main');
const siteEventContainerElement = siteMainElement.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.page-header');
const filterContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter(siteEventContainerElement, pointsModel);
const filters = generateFilter(pointsModel.points);

render(new FilterView(filters), filterContainerElement);

tripPresenter.init();
