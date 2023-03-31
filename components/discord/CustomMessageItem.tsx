import React from "react";
import { FetchDiscord } from "js/connection";
import { showToast } from "components/Toast";
import { ICustomMessageOption } from "js/discord/customMessage";

type MessageType = {
  message: string;
  possibilities: Array<ICustomMessageOption>;
};

export default function CustomMessageItem(props: any) {
  const [state, setState] = React.useState({ title: null });
  let message: MessageType = props.message;

  var textDescRef = React.createRef<HTMLTextAreaElement>();

  React.useEffect(() => {
    if (!message) return;
    if (state.title != props.title) {
      setState({ title: props.title });
      if (textDescRef.current) textDescRef.current.value = message.message;
    }
  }, [setState, state, message, textDescRef, props]);

  if (!message) return <></>;

  const onSaveMessage = (e: any) => {
    if (!textDescRef.current) return;
    FetchDiscord(
      "/discord/save-custom-messages",
      { body: { name: props.title, message: textDescRef.current.value } },
      (r: any) => {
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
                  onClick={(e: any) => {
                    let range = new Range();
                    range.setStart(e.target, 0);
                    range.setEnd(e.target, 1);
                    let selection = document.getSelection();
                    if (!selection) return;
                    selection.removeAllRanges();
                    selection.addRange(range);
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
            rows={3}
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
