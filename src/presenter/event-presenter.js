import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoPointView from '../view/no-point-view.js';
import EventItemPresenter from './event-item-presenter';
import EventNewPresenter from './event-new-presenter.js';
import { sortEventDay, sortEventTime, sortEventPrice, filter } from '../utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../data.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class EventPresenter {
  #eventContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #eventItemPresenter = new Map();
  #eventNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  #tripListComponent = new TripListView();
  #sortComponent = null;
  #noPointComponent = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(eventContainer, pointsModel, filterModel) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#eventNewPresenter = new EventNewPresenter(this.#tripListComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredEvents = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredEvents.sort(sortEventDay);
      case SortType.TIME:
        return filteredEvents.sort(sortEventTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortEventPrice);
    }

    return filteredEvents;
  }

  init = () => {
    this.#renderEventSection();
  };

  createEvent = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#eventNewPresenter.init(callback, this.#pointsModel);
  };

  #handleModeChange = () => {
    this.#eventNewPresenter.destroy();
    this.#eventItemPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventItemPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventItemPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#eventNewPresenter.setSaving();
        try {
          await this.#pointsModel.addEvent(updateType, update);
        } catch(err) {
          this.#eventNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventItemPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventItemPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventItemPresenter.get(data.id).init(data, this.#pointsModel);
        break;
      case UpdateType.MINOR:
        this.#clearEventSection();
        this.#renderEventSection();
        break;
      case UpdateType.MAJOR:
        this.#clearEventSection({resetSortType: true});
        this.#renderEventSection();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEventSection();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventSection();
    this.#renderEventSection();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const eventItemPresenter = new EventItemPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#handleModeChange);
    eventItemPresenter.init(point, this.#pointsModel);
    this.#eventItemPresenter.set(point.id, eventItemPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#filterType);
    render(this.#noPointComponent, this.#eventContainer, RenderPosition.AFTERBEGIN);
  };


  #clearEventSection = ({resetSortType = false} = {}) => {
    this.#eventNewPresenter.destroy();
    this.#eventItemPresenter.forEach((presenter) => presenter.destroy());
    this.#eventItemPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderEventSection = () => {
    render(this.#tripListComponent, this.#eventContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.events;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints(points);
  };

}
