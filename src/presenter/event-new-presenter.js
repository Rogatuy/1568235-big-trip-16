import EventEditView from '../view/event-edit-view.js';
import { render, RenderPosition, remove } from '../utils/render';
import { UpdateType, UserAction } from '../const.js';


export default class EventNewPresenter {
  #eventListContainer = null;
  #changeData = null;
  #eventEditComponent = null;
  #buttonAdd = document.querySelector('.trip-main__event-add-btn');

  constructor(eventListContainer, changeData) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
  }

  init = (destinations, offers) => {
    this.#eventEditComponent = new EventEditView(destinations, offers);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#eventListContainer, this.#eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#eventEditComponent === null) {
      return;
    }

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    this.#eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
    this.#buttonAdd.disabled = false;
  }

  #handleDeleteClick = () => {
    this.destroy();
    this.#buttonAdd.disabled = false;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
      this.#buttonAdd.disabled = false;
    }
  }

}
