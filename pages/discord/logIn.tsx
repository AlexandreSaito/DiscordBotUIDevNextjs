import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { FetchResponse } from "js/connection";
import { LoginContext, LoginEnum } from "context/login";

const Home: NextPageWithLayout = (props: any) => {
  const [state, setState] = React.useState({ data: null });

  const userTagRef = React.createRef<HTMLInputElement>();
  const userTagFeedbackRef = React.createRef<HTMLDivElement>();
  const btnSendRef = React.createRef<HTMLButtonElement>();

  const { getLoginFrom, setLogin } = React.useContext(LoginContext);

  const onUserTagMouseDown = (e: any) => {
    if (e.key == "Enter" && btnSendRef.current) {
      btnSendRef.current.click();
    }
  };

  const onSend = (e: any) => {
    if (
      !btnSendRef.current ||
      !userTagRef.current ||
      !userTagRef.current ||
      !userTagFeedbackRef.current
    )
      return;
    btnSendRef.current.disabled = true;
    userTagRef.current.readOnly = true;
    userTagRef.current.classList.remove("is-invalid");
    if (userTagRef.current.value == "") {
      userTagRef.current.classList.add("is-invalid");
      userTagFeedbackRef.current.innerHTML = "User TAG não pode ser vazio!";
      return;
    }
    FetchResponse(
      "/api/discord/get-bot-list",
      { body: { userTag: userTagRef.current.value } },
      (r: any) => {
        if (
          !btnSendRef.current ||
          !userTagRef.current ||
          !userTagRef.current ||
          !userTagFeedbackRef.current
        )
          return;
        console.log(r);
        if (r.alert == "danger" || !r.data) {
          btnSendRef.current.disabled = false;
          userTagRef.current.readOnly = false;
          userTagFeedbackRef.current.innerHTML = r.message
            ? r.message
            : "Not finded Guild with this user";
          userTagRef.current.classList.add("is-invalid");
          return;
        }

        setState({ data: r.data });
      }
    );
  };
  const router = useRouter();

  const onSelectBot = (id: number, url: string) => {
    if (!userTagRef.current || !userTagRef.current) return;

    FetchResponse(
      `${url}/discord/confirm`,
      { body: { userTag: userTagRef.current.value.trim() } },
      (r) => {
        if (r.alert == "danger") {
          // should show alert
          return;
        }
        console.log(r.guildId, r.userId, r.userName);
        setLogin(LoginEnum.Discord, userTagRef.current.value, {
          permissions: state.data ? state.data.map((x) => x.id) : [],
          discordGuild: r.guildId,
          discordGuildName: r.guildName,
          discordId: r.userId,
          discordName: r.userName,
        });
        router.push(`/discord/${id}`);
      }
    );
  };

  let discordOptions = [];
  if (state.data) {
    discordOptions = state.data.map((x) => {
      let guildId = "";
      return (
        <button
          key={x.id}
          className="list-group-item list-group-item-action"
          onClick={() => {
            onSelectBot(x.id, x.url, guildId);
          }}
        >
          {x.id.toString().padStart(2, "0")} - {x.res.botName} // Guild:{" "}
          <b>{x.res.guilds[0]}</b>
        </button>
      );
    });
  }

  return (
    <div className="card">
      <h4 className="card-header">Log-in</h4>
      <div className="card-body">
        <div className="input-group has-validation mb-3">
          <span className="input-group-text">User TAG</span>
          <input
            type="text"
            className="form-control"
            placeholder="User#0000"
            ref={userTagRef}
            onKeyDown={onUserTagMouseDown}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onSend}
            ref={btnSendRef}
          >
            Send
          </button>
          <div className="invalid-feedback" ref={userTagFeedbackRef}></div>
        </div>
        <div className="list-group">{discordOptions}</div>
      </div>
    </div>
  );
};

export default Home;
