import React from "react";
import { copyChangeObject } from "./objectHandler";

var lastKey = 0;
var layout = null;

export function setHandler(currentLayout) {
  layout = currentLayout;
}

export function showToast(params) {
  layout.setToast(CreateToast(params));
}

export function CreateToast({
  message = "",
  title = "",
  alert = "secondary",
  timeout = 10000,
}) {
  var key = lastKey++;
  const onClose = (e) => {
    e.preventDefault();
    layout.removeToast(key);
  };

  const messageEl =
    message && message != "" ? (
      <div className="toast-body">{message}</div>
    ) : null;

  const toastClass = `toast show bg-${alert}`;

  if (alert != "danger" && timeout > 0)
    setTimeout(() => {
      onClose({ preventDefault: () => {} });
    }, timeout);

  const toast = (
    <div
      key={key}
      className={toastClass}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide="false"
    >
      <div className="toast-header">
        <strong className="me-auto">{title}</strong>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      {messageEl}
    </div>
  );

  return toast;
}
