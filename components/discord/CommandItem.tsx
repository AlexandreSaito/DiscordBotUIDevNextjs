import React from "react";
import { displayModal, confirmModal } from "components/Modal";
import { DiscordContext } from "context/discord";
import { copyChangeObject, changeState } from "js/objectHandler";
import { FetchDiscord } from "js/connection";
import { showToast } from "components/Toast";
import TableUser from "components/discord/TableUser";
import TableRole from "components/discord/TableRole";

function UserExcp({ guildId, state, setState }) {
  let searchUserRef = React.createRef();

  const onAddUser = (e: any) => {
    const onSelectUser = (user) => {
      modal.hide();

      if (
        state.rule.userException &&
        state.rule.userException.find((x) => x.id == user.id)
      ) {
        showToast({ message: "User already added", alert: "warning" });
        return;
      }

      let currentUser = [
        {
          id: user.id,
          userName: user.name,
          canSend: !state.rule.everyoneCanSend,
        },
      ];

      changeState(setState, state, {
        rule: {
          userException: state.rule.userException
            ? state.rule.userException.concat(currentUser)
            : currentUser,
        },
      });
    };
    let modal = displayModal(
      "ADD USER",
      <TableUser guildId={guildId} onSelectUser={onSelectUser}></TableUser>
    );
  };

  const onChangeSearchUser = (e: any) => {
    changeState(setState, state, {
      userSearch: searchUserRef.current.value.toLowerCase(),
    });
  };

  const onChangeCanSend = (ref, user) => {
    const list = state.rule.userException;
    const item = list.find((y) => y.id == user.id);
    item.canSend = ref.current.checked;
    changeState(setState, state, {
      rule: {
        userException: list,
      },
    });
  };

  let userList = null;
  if (state.rule.userException) {
    userList = state.rule.userException
      .filter((x) => x.userName.toLowerCase().startsWith(state.userSearch))
      .map((x) => {
        const canSendRef = React.createRef();

        return (
          <tr key={x.id}>
            <td>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  ref={canSendRef}
                  onChange={() => {
                    onChangeCanSend(canSendRef, x);
                  }}
                  value={x.canSend}
                />
              </div>
            </td>
            <td colSpan={2}>{x.userName}</td>
          </tr>
        );
      });
  }

  return (
    <table className="table table-sm caption-top">
      <thead>
        <tr>
          <th style={{ width: "85px" }}>Can Send</th>
          <th>
            <div className="input-group input-group-sm">
              <span className="input-group-text">Search</span>
              <input
                type="text"
                className="form-control"
                ref={searchUserRef}
                onChange={onChangeSearchUser}
                value={state.userSearch}
              />
            </div>
          </th>
          <th style={{ width: "85px" }}>
            <button className="btn btn-primary btn-sm" onClick={onAddUser}>
              Add User
            </button>
          </th>
        </tr>
      </thead>
      <tbody>{userList}</tbody>
      <caption>User Exceptions</caption>
    </table>
  );
}

function RoleExcp({ guildId, state, setState }) {
  let searchRef = React.createRef();

  const onAdd = (e: any) => {
    const onSelect = (role) => {
      modal.hide();

      if (
        state.rule.roleException &&
        state.rule.roleException.find((x) => x.id == role.id)
      ) {
        showToast({ message: "Role already added", alert: "warning" });
        return;
      }

      let current = [
        {
          id: role.id,
          roleName: role.name,
          canSend: !state.rule.everyoneCanSend,
        },
      ];

      changeState(setState, state, {
        rule: {
          roleException: state.rule.roleException
            ? state.rule.roleException.concat(current)
            : current,
        },
      });
    };
    let modal = displayModal(
      "ADD ROLE",
      <TableRole guildId={guildId} onSelectRole={onSelect}></TableRole>
    );
  };

  const onChangeSearch = (e: any) => {
    changeState(setState, state, {
      roleSearch: searchRef.current.value.toLowerCase(),
    });
  };

  let list = null;
  if (state.rule.userException) {
    list = state.rule.roleException
      .filter((x) => x.roleName.toLowerCase().startsWith(state.userSearch))
      .map((x) => {
        return (
          <tr key={x.id}>
            <td>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" />
              </div>
            </td>
            <td colSpan={2}>{x.roleName}</td>
          </tr>
        );
      });
  }

  return (
    <table className="table table-sm caption-top">
      <thead>
        <tr>
          <th style={{ width: "85px" }}>Can Send</th>
          <th>
            <div className="input-group input-group-sm">
              <span className="input-group-text">Search</span>
              <input
                type="text"
                className="form-control"
                ref={searchRef}
                onChange={onChangeSearch}
                value={state.roleSearch}
              />
            </div>
          </th>
          <th style={{ width: "85px" }}>
            <button className="btn btn-primary btn-sm" onClick={onAdd}>
              Add Role
            </button>
          </th>
        </tr>
      </thead>
      <tbody>{list}</tbody>
      <caption>Role Exceptions</caption>
    </table>
  );
}

function CommandItem(props: any) {
  const { ctx, changeCtx } = React.useContext(DiscordContext);
  const [state, setState] = React.useState({
    name: "",
    userSearch: "",
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
          userException: state.rule.userException,
          roleException: state.rule.roleException,
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
            <p className="card-text text-muted">
              Admin always can do everything
            </p>
          </div>
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
          <div className="col-12">
            <UserExcp
              guildId={ctx.guild.current.id}
              state={state}
              setState={setState}
            ></UserExcp>
          </div>
          <div className="col-12">
            <RoleExcp
              guildId={ctx.guild.current.id}
              state={state}
              setState={setState}
            ></RoleExcp>
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
