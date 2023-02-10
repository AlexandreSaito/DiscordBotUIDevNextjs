import React from "react";
import { FetchDiscord } from "/js/connection";
import { showToast } from "/components/Toast";

export default function CustomMessageItem(props) {
  const [state, setState] = React.useState({ title: null });
  let message = props.message;

  var textDescRef = React.createRef();

  React.useEffect(() => {
    if (!message) return;
    if (state.title != props.title) {
      setState({ title: props.title });
      textDescRef.current.value = message.message;
    }
  });

  if (!message) return <></>;

  const onSaveMessage = (e) => {
    FetchDiscord(
      "/discord/save-custom-messages",
      { body: { name: props.title, message: textDescRef.current.value } },
      (r) => {
        showToast({
          title: "CUSTOM MESSAGE SAVE",
          message: r.message,
          alert: r.alert,
        });
        if (r.alert == "success") props.loadMessages();
      }
    );
  };

  return (
    <div className="card">
      <h4 className="card-header">{props.title}</h4>
      <div className="card-body">
        <b>Possibilities</b>
        <ul className="list-group list-group-sm mb-2">
          {message.possibilities.map((x, i) => {
            let text = `{${x.name}}`;
            return (
              <li key={i} className="list-group-item text-sm">
                <b
                  onClick={(e) => {
                    let range = new Range();
                    range.setStart(e.target, 0);
                    range.setEnd(e.target, 1);
                    document.getSelection().removeAllRanges();
                    document.getSelection().addRange(range);
                  }}
                >
                  {text}
                </b>{" "}
                - {x.desc}
              </li>
            );
          })}
        </ul>
        <div className="form-floating">
          <textarea
            className="form-control"
            placeholder=" "
            ref={textDescRef}
            rows="3"
          ></textarea>
          <label>Message</label>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-success float-end" onClick={onSaveMessage}>
          Save
        </button>
      </div>
    </div>
  );
}
