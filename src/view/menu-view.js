import { MenuItem } from '../const.js';
import AbstractView from './abstract-view.js';
import {siteHeaderElement} from '../main.js';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MenuItem.TABLE}</a>
    <a class="trip-tabs__btn" href="#">${MenuItem.STATS}</a>
  </nav>`
);

export default class SiteMenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  setMenuItem = (menuItem) => {
    const item = this.element.querySelector(`[text=${menuItem}]`);


    if (item !== null) {
      item.classList.add('.trip-tabs__btn--active'); //спросить у Жени, как сделать этот момент
    }
  }


  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'A' && !evt.target.classList.contains('trip-tabs__btn--active')) {
      this.element.querySelector('.trip-tabs__btn--active').classList.remove('trip-tabs__btn--active');
      evt.target.classList.add('trip-tabs__btn--active');
      const buttonAddEvent = siteHeaderElement.querySelector('.btn--big');
      buttonAddEvent.disabled = !(buttonAddEvent.hasAttribute('disabled'));
      this._callback.menuClick(evt.target);
    }
  }
}

