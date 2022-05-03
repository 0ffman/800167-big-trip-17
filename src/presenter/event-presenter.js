import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripListItemView from '../view/trip-list-item-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripPresenter {

  tripListComponent = new TripListView();
  tripListItemComponent = new TripListItemView();
  pointEditComponent = new PointEditView();

  init = (eventContainer, pointsModel) => {
    this.eventContainer = eventContainer;
    this.pointsModel = pointsModel;
    this.eventPoints = [...this.pointsModel.getPoints()];

    render(new SortView(), this.eventContainer);
    render(this.tripListComponent, this.eventContainer);

    for (let i = 0; i < this.eventPoints.length; i++) {
      render(new TripListItemView(), this.tripListComponent.getElement());
    }

    const tripEventElements = Array.from(document.querySelector('.trip-events__list').children);

    tripEventElements.forEach((item, index) => {
      //console.log(item, index);
      render(new PointView(this.eventPoints[index]), item);
    });

    render(this.tripListItemComponent, this.tripListComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(this.pointEditComponent, this.tripListItemComponent.getElement());
  };
}
