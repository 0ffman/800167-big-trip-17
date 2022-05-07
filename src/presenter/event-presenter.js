import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { render } from '../render.js';

export default class TripPresenter {

  tripListComponent = new TripListView();
  pointEditComponent = new PointEditView();

  init = (eventContainer, pointsModel) => {
    this.eventContainer = eventContainer;
    this.pointsModel = pointsModel;
    this.eventPoints = [...this.pointsModel.getPoints()];
    const editPoint = this.eventPoints[0];

    render(new SortView(), this.eventContainer);
    render(this.tripListComponent, this.eventContainer);

    render(new PointEditView(editPoint), this.tripListComponent.getElement());
    for (let i = 0; i < this.eventPoints.length; i++) {
      render(new PointView(this.eventPoints[i]), this.tripListComponent.getElement());
    }
  };
}
