import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render';
import { UpdateType, UserAction } from '../const.js';


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class EventPresenter {
  #eventListContainer = null;
  #changeData = null;
  #changeMode = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #mode = Mode.DEFAULT;

  constructor(eventListContainer, changeData, changeMode) {
    this.#eventListContainer = eventListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (event, offers, destinations) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView(event);
    this.#eventEditComponent = new EventEditView(destinations, offers, event);

    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#eventEditComponent.setEditClickHandler(this.#handleCloseClick);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventListContainer, this.#eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventComponent, prevEventEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#eventComponent.shake(resetFormState);
        this.#eventEditComponent.shake(resetFormState);
        break;
    }
  }

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #replaceEventToForm = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  }

  #handleEditClick = () => {
    this.#replaceEventToForm();
  }

  #handleCloseClick = () => {
    this.#eventEditComponent.reset(this.#event);
    this.#replaceFormToEvent();
  }

  #handleFormSubmit = (update) => {
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      update,
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#event, isFavorite: !this.#event.isFavorite});
    this.#changeData (
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  }

  #handleDeleteClick = (event) => {
    this.#changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  }

}
