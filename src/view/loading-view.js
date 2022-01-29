import AbstractView from './abstract-view.js';

const createNoEventTemplate = () => (
  `<p class="board__no-event">
    Loading...
  </p>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoEventTemplate();
  }
}
