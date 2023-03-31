import React from "react";
import { displayModal, confirmModal } from "components/Modal";
import { DiscordContext } from "context/discord";
import { copyChangeObject, changeState } from "js/objectHandler";
import { FetchDiscord } from "js/connection";
import { showToast } from "components/Toast";

function CommandItem(props: any) {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({
    name: "",
    rule: { active: false, everyoneCanSend: false },
  });

  let cmd = props.cmd;

  if (!state.name || state.name != cmd.name) {
    let rule = props.cmdRule ? props.cmdRule : ctx.command.default.command;
    if (!rule) rule.name = cmd.name;
    else
      rule = copyChangeObject(
        ctx.command.default.command,
        Object.assign({}, rule)
      );
    changeState(setState, state, {
      name: cmd.name,
      rule: rule,
    });
    console.log(rule);
  }

  let swActiveRef = React.createRef<HTMLInputElement>();
  let chkEveryoneSendRef = React.createRef<HTMLInputElement>();

  const onChangeActive = (e: any) => {
    if (!swActiveRef.current) return;
    let actived = swActiveRef.current.checked;
    changeState(setState, state, {
      rule: { active: actived },
    });
    confirmModal(
      "ACTIVE/INACTIVE COMMAND",
      `Whant to ${actived ? "ACTIVE" : "INACTIVE"} command?`,
      () => {
        FetchDiscord(
          "/discord/active-inactive-commands",
          { body: { commandName: state.name, active: actived } },
          (r: any) => {
            if (r.alert == "success") {
              showToast({
                title: "ACTIVE/INACTIVE COMMAND",
                message: `${state.name} was ${
                  actived ? "ACTIVE" : "INACTIVE"
                } with success!`,
                alert: r.alert,
              });
            } else {
              showToast({
                title: "ACTIVE/INACTIVE COMMAND",
                message: `Failed to ${actived ? "ACTIVE" : "INACTIVE"} ${
                  state.name
                }!`,
                alert: r.alert,
              });
            }
          }
        );
      },
      () => {
        changeState(setState, state, { rule: { active: !actived } });
      }
    );
  };
  const onChangeEveryoneCanSend = (e: any) => {
    if (!chkEveryoneSendRef.current) return;
    changeState(setState, state, {
      rule: { everyoneCanSend: chkEveryoneSendRef.current.checked },
    });
  };
  const onSave = (e: any) => {
    FetchDiscord(
      "/discord/update-command",
      {
        body: {
          commandName: state.name,
          canSend: state.rule.everyoneCanSend,
        },
      },
      (r: any) => {
        if (r.alert == "success") {
          showToast({
            title: "COMMAND UPDATE",
            message: `success!`,
            alert: r.alert,
          });
        } else {
          showToast({
            title: "COMMAND UPDATE",
            message: `Failed!`,
            alert: r.alert,
          });
        }
      }
    );
  };
  const onAddRole = (e: any) => {
    let modal = displayModal("ADD ROLE", "should show roles...");
  };

  return (
    <div className="card">
      <h5 className="card-header">
        {cmd.name}
        <div className="form-check form-switch form-check-inline float-end">
          <label className="form-check-label">
            <input
              className="form-check-input"
              type="checkbox"
              ref={swActiveRef}
              checked={state.rule.active}
              onChange={onChangeActive}
            />
            Active
          </label>
        </div>
      </h5>
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <div className="form-check">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  ref={chkEveryoneSendRef}
                  onChange={onChangeEveryoneCanSend}
                  checked={state.rule.everyoneCanSend}
                />
                Everyone can send
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-success float-end" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default CommandItem;
