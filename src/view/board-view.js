import AbstractView from './abstract-view.js';

const createBoardTemplate = () => '<section class="trip-events container"></section>';

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }
}
