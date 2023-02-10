import React from "react";

var confirmationModal = null;
var displayModalRef = null;

export function ConfirmationModal() {
  confirmationModal = React.createRef();
  return (
    <div
      className="modal"
      tabIndex="-1"
      ref={confirmationModal}
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
          </div>
          <div className="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              id="mdl-btn-cancel-changes"
              className="btn btn-secondary btn-sm"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="mdl-btn-save-changes"
              className="btn btn-primary btn-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DisplayModal() {
  displayModalRef = React.createRef();
  return (
    <div
      className="modal"
      tabIndex="-1"
      ref={displayModalRef}
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"></h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
}

export function confirmModal(title = "", text = "", onConfirm, onCancel) {
  let modal = bootstrap.Modal.getOrCreateInstance(confirmationModal.current);
  let btnConfirm = confirmationModal.current.querySelector(
    "#mdl-btn-save-changes"
  );
  let btnCancel = confirmationModal.current.querySelector(
    "#mdl-btn-cancel-changes"
  );

  confirmationModal.current.querySelector(".modal-title").innerHTML = title;
  confirmationModal.current.querySelector(".modal-body").innerHTML = text;

  const onConfirmClick = (e) => {
    e.preventDefault();

    btnCancel.removeEventListener("click", onCancelClick, false);
    btnConfirm.removeEventListener("click", onConfirmClick, false);

    if (onConfirm) onConfirm();
    modal.hide();
  };
  const onCancelClick = (e) => {
    e.preventDefault();

    btnConfirm.removeEventListener("click", onConfirmClick, false);
    btnCancel.removeEventListener("click", onCancelClick, false);

    if (onCancel) onCancel();
    modal.hide();
  };
  btnConfirm.addEventListener("click", onConfirmClick, false);
  btnCancel.addEventListener("click", onCancelClick, false);

  modal.show();
}

export function displayModal(title = "", content = null) {
  let modal = bootstrap.Modal.getOrCreateInstance(displayModalRef.current);

  displayModalRef.current.querySelector(".modal-title").innerHTML = title;
  displayModalRef.current.querySelector(".modal-body").innerHTML = content;

  modal.show();
  return modal;
}

export function FormModal(
  content,
  title,
  { formValidation, onSave, onCancel, onHide },
  outer
) {
  outer.modalRef = React.createRef();

  const getModal = () => {
    if (!outer.modal)
      outer.modal = bootstrap.Modal.getOrCreateInstance(outer.modalRef.current);
    return outer.modal;
  };

  outer.getModal = getModal;

  const onBtnSave = (e) => {
    e.preventDefault();

    if (formValidation) if (!formValidation()) return;

    if (onSave) onSave();
    else outer.getModal().hide();
  };

  const onBtnCancel = (e) => {
    e.preventDefault();

    let modal = getModal();
    modal.hide();

    if (onCancel) onCancel();
  };

  return (
    <div className="modal" ref={outer.modalRef} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">{content}</div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onBtnCancel}
              className="btn btn-secondary btn-sm"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onBtnSave}
              className="btn btn-primary btn-sm"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
