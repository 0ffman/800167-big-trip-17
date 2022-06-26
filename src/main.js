import {render} from './framework/render.js';
import EventPresenter from './presenter/event-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic HbRfg4yrhgDjfTB';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const siteMainElement = document.querySelector('.page-main');
const siteMainSectionElement = document.querySelector('.trip-main');
const siteTripBlockElement = siteMainSectionElement.querySelector('.trip-info');
const siteEventContainerElement = siteMainElement.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.page-header');
const filterContainerElement = siteHeaderElement.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const eventPresenter = new EventPresenter(siteEventContainerElement, pointsModel, filterModel, siteTripBlockElement);
const filterPresenter = new FilterPresenter(filterContainerElement, filterModel, pointsModel);
const newEventButtonComponent = new NewEventButtonView();

const handleNewEventFormClose = () => {
  newEventButtonComponent.element.disabled = false;
};

const handleNewEventButtonClick = () => {
  eventPresenter.createEvent(handleNewEventFormClose);
  newEventButtonComponent.element.disabled = true;
};

eventPresenter.init();
filterPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newEventButtonComponent, siteMainSectionElement);
    newEventButtonComponent.setClickHandler(handleNewEventButtonClick);
  });
